import { updateUser } from "./user.js";

const verifyOTP = async (tool, cellphone, country_code) => {
  const functionArgs = JSON.parse(tool?.function?.arguments);
  const code = `${functionArgs?.otp}`;

  await fetch("https://api2.heru.app/signin/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      cellphone,
      country_code,
      acquisition_channel_id: 5,
      code,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("VERIFY RESPONSE", data, "\n\n");
      updateUser(
        cellphone,
        data?.resource?.access_token?.access_token,
        data?.resource?.id
      );
    })
    .catch((error) => {
      console.error("ERROR", error);
    });

  return {
    tool_call_id: tool.id,
    output: "Verificacion exitosa, el usuario ha sido autenticado exitosamente",
  };
};

export { verifyOTP };
