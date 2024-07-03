require("dotenv").config();

module.exports = {
  // please enter your mysql local username and its password below
  yourLocalMySQLUsername: "root2",
  yourLocalMySQLPassword: "1234",

  host: process.env.CLEARDB_HOST || "localhost",
  port: 3306,
  user: process.env.CLEARDB_USER || "gpamanager",
  password: process.env.CLEARDB_PASSWORD || "1234",
  database: process.env.CLEARDB_DATABASE || "gpadb",
  table_conversion: "conversion",
  table_conversion2: "conversion2",
  table_user: "user",
  table_semester: "semester",
  table_course: "course",
  table_assessment: "assessment",
  table_announcement: "announcement",
  connectionLimit: 100,
};
