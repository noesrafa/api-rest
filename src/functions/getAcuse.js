import User from "../models/user.model.js";

const fetchDeclarationsByPeriod = async (userProfile, period) => {
  try {
    console.log(
      `https://api2.heru.app/tax/fiscal-profile/declarations/montly-overview/45604/${period.year}/${period.month}`
    );
    const response = await fetch(
      // `https://api2.heru.app/tax/fiscal-profile/declarations/montly-overview/${userProfile.heruId}/${period.year}/${period.month}`,
      `https://api2.heru.app/tax/fiscal-profile/declarations/montly-overview/45604/${period.year}/${period.month}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userProfile.token}`,
        },
      }
    );

    const responseJson = await response.json();
    const presentedDeclarations =
      responseJson?.resource?.declarations?.declarations?.filter(
        (declaration) => declaration.status === "PRESENTADA"
      );

    const lastDeclarationId = presentedDeclarations.sort(
      (a, b) => new Date(b.declarationDate) - new Date(a.declarationDate)
    )?.[0]?.declarationId;

    console.log("\n\n ==== DECLARACIONES ====\n\n", responseJson);

    return lastDeclarationId;
  } catch (error) {
    return { error, message: "Error al obtener las declaraciones por periodo" };
  }
};

const fetchDeclarationById = async (userProfile, declarationId) => {
  try {
    const response = await fetch(
      `https://api2.heru.app/tax/fiscal-profile/declarations/montly-overview/detail/${declarationId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userProfile.token}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    return { error, message: "Error al obtener la declaracion por id" };
  }
};

const getAcuse = async (tool, userInfo) => {
  console.log("\n\n ==== ACUSE ====\n\n", tool, userInfo);
  let user = await User.findOne({ email: userInfo.cellphone });
  const functionArgs = JSON.parse(tool?.function?.arguments);
  console.log("\n\n ==== USER ====\n\n", user);

  if (functionArgs?.year < 2019) {
    return {
      tool_call_id: tool.id,
      output:
        "Lo siento, pero no es posible obtener acuses de años anteriores a 2019. Por favor, intenta con un año mas reciente.",
    };
  }
  if (functionArgs?.year > new Date().getFullYear()) {
    return {
      tool_call_id: tool.id,
      output:
        "Lo siento, pero no es posible obtener acuses de años futuros. Por favor, intenta con un año mas reciente.",
    };
  }

  if (!user) {
    throw new Error("Usuario no encontrado al buscar acuse");
  }

  if (!user.token) {
    return {
      tool_call_id: tool.id,
      output:
        "El usuario no se ha autenticado, preguntale si esta de acuerdo con que le envies un codigo de autenticacion, si esta de acuerdo, enviale el codigo de autenticacion",
    };
  }
  console.log("\n\n ==== FUNCTION ARGS ====\n\n", functionArgs);

  const declarationId = await fetchDeclarationsByPeriod(user, {
    year: functionArgs?.year,
    month: functionArgs?.month,
  });

  const declarationInfo = await fetchDeclarationById(user, declarationId);

  console.log("\n\n ==== Declaracion ====\n\n", declarationInfo);

  const url = declarationInfo?.resource?.pdfUrl;

  return {
    tool_call_id: tool.id,
    output: url
      ? `Listo, puedes acceder a tu acuse del periodo ${functionArgs?.month}/${functionArgs?.year} desde el siguiente enlace: ${url}`
      : "No se encontro el acuse, esto puede deberse a diferentes factores, por favor intenta de nuevo mas tarde. Si el problema persiste, te transmitiremos a un asesor para que te ayude a obtener tu acuse.",
  };
};

export { getAcuse };
