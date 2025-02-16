const app = require("./app")
const pool = require("./src/config/db")
require("dotenv").config({ path: require("path").resolve(__dirname, "./.env") });

const PORT = process.env.PORT || 3000;

const testDatabaseConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Conectado a PostgreSQL en:", res.rows[0].now);
  } catch (error) {
    console.error("Error conectando a PostgreSQL:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  await testDatabaseConnection()

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer()

