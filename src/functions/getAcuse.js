import User from "../models/user.model.js";

const getAcuse = async (tool, userInfo) => {
  let user = await User.findOne({ email: userInfo.cellphone });

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

  const functionArgs = JSON.parse(tool?.function?.arguments);

  const fakeApiCall = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://acuse.com/1234567890");
      }, 200);
    });
  };

  const acuseUrl = await fakeApiCall();
  console.log("Acuse URL:", acuseUrl, tool);

  return {
    tool_call_id: tool.id,
    output: `Acuse ${functionArgs?.month}/${functionArgs?.year} exitosamente, puedes descargarlo desde el siguiente enlace: https://acuse.com/1234567890`,
  };
};

export { getAcuse };
