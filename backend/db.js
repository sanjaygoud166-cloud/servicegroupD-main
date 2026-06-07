const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com",
  port: 4000,
  user: "4REMW5aV6Y8kMnY.root",
  password: "7rGmyfUE06LskU5P",
  database: "test",
  ssl: {
    rejectUnauthorized: true
  }
});

connection.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Database Connected Successfully");
  }
});

module.exports = connection;