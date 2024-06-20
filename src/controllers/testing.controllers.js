import { sendOtp } from "../functions/sendOtp.js";
import { verifyOTP } from "../functions/verifyOtp.js";

const testingTool = async (req, res) => {
  await verifyOTP(
    {
      id: "call_IvWt7J8SsqFjmt9PRD2I3oki",
      type: "function",
      function: { name: "verify_otp", arguments: '{"otp":"084780"}' },
    },
    "5529985379",
    "+52"
  );

  return res.status(200).json({
    message: "Testing route works",
  });
};

export { testingTool };
