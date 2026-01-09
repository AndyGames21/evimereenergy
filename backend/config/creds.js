require("dotenv").config();

module.exports = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432
  },
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || ""
};
