const sendOtp = async (tool, cellphone, country_code) => {
  const response = await fetch(
    "https://api2.heru.app/signin/send-otp?platform=android",
    {
      method: "POST",
      body: JSON.stringify({
        cellphone,
        country_code,
        heru_pal: false,
        send_by: "sms",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("SEND OTP", cellphone, country_code, response, "\n\n");

  return {
    tool_call_id: tool.id,
    output:
      "OTP enviado exitosamente, por favor solicita al usuario que ingrese el codigo de autenticacion",
  };
};

export { sendOtp };
