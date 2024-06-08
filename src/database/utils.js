import fs from "fs";

const saveToDatabase = (data) =>
  fs.writeFileSync("./src/database/db.json", JSON.stringify(data, null, 2), {
    encoding: "utf8",
  });

export { saveToDatabase };
