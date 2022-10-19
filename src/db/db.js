const { resolve } = require("path");
require("dotenv").config({ path: resolve(__dirname, "../src/config/.env") });
const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  const url = process.env.PROD_DB_STRING;
  await mongoose.connect(url);
}
