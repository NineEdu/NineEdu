import db from "./src/libs/db.js";

export default async function testDBConnection() {
  try {
    await db.sequelize.authenticate();
  } catch (error) {}
}
