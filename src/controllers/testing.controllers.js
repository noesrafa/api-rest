import { getAcuse } from "../functions/getAcuse.js";

const testingTool = async (req, res) => {
  const response = await getAcuse(
    {
      id: "call_OiybIEyd1VdONMklTjOXQ6Q7",
      type: "function",
      function: { name: "get_acuse", arguments: '{"month":9,"year":2023}' },
    },
    { cellphone: "5529985379", country_code: "+52" }
  );

  return res.status(200).json({
    message: "Testing route works",
    response,
  });
};

export { testingTool };
