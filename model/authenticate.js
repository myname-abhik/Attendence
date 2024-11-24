const mysql = require("mysql2");
require("dotenv").config();

let connection = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
});

exports.connect = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err.stack);
      return;
    }
    console.log("Connected to the database");
  });
};

const keepAliveQuery = () => {
  try {
    connection.ping();
  } catch (err) {
    console.error("Error pinging database:", err.stack);
  }
};

// Set an interval to run the keep-alive query every 5 minutes (300000 milliseconds)
setInterval(keepAliveQuery, 300000);

// connection.getConnection((err, connection) => {
//     if (err) {
//         console.error('Error getting connection from pool:', err.stack);
//         return;
//     }
//     console.log('Connected to the database');

//     // // Use the connection
//     // connection.query('SELECT 1', (err, results) => {
//     //     connection.release(); // Release the connection back to the pool

//     //     if (err) {
//     //         console.error('Error executing query:', err.stack);
//     //         return;
//     //     }
//     //     console.log('Query results:', results);
//     // });
// });

exports.connection = connection;
exports.create_Faculty_registered_details = () => {
  // Ensure you're using the correct database before creating the table
  connection.query(
    "CREATE TABLE IF NOT EXISTS Faculty_registered_details (reg_no INT PRIMARY KEY AUTO_INCREMENT,Full_Name VARCHAR(300) NOT NULL, Email VARCHAR(100) NOT NULL,Phone VARCHAR(10) NOT NULL,Post VARCHAR(100) NOT NULL,Department VARCHAR(200) NOT NULL,Teacher_Registraion_Id varchar(200) not null);",
    (err, results) => {
      if (err) {
        console.error("Error creating table:", err.stack);
        return;
      }
      console.log(
        "Table created or already exists: Faculty_registered_details"
      );
    }
  );
};

exports.create_Admin_registered_details = () => {
  // Ensure you're using the correct database before creating the table
  connection.query(
    "CREATE TABLE IF NOT EXISTS Admin_registered_details (reg_no INT PRIMARY KEY AUTO_INCREMENT, Full_Name VARCHAR(300) NOT NULL, Email VARCHAR(100) NOT NULL UNIQUE, Phone varchar(10) not null, Department varchar(200) not null, Teacher_Registration_Id varchar(200) not null, Password varchar(200) not null);",
    (err, results) => {
      
      if (err) {
        console.error("Error creating table:", err.stack);
        return;
      }
      console.log("Table created or already exists: Admin_registered_details");
    }
  );
};

exports.create_Classs_room = () => {
  // Ensure you're using the correct database before creating the table
  connection.query(
    "CREATE TABLE IF NOT EXISTS Class_Room (Subject_Name varchar(200) not null, Subject_Code VARCHAR(300) NOT NULL, Session VARCHAR(100) NOT NULL, Year VARCHAR(100) not null, Semester_Type varchar(100)  not null, Class_Type varchar(200) not null,Teacher_Name varchar(200) not null,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,Teacher_Registration_Id varchar(200) not null, Department varchar(200) not null,Classroom_id varchar(200) primary key,Section varchar(200) not null, Semester varchar(200) not null, Total_Students varchar(200) not null)",
    (err, results) => {
      if (err) {
        console.error("Error creating table:", err.stack);
        return;
      }
      console.log("Table created or already exists: Classs_room");
    }
  );
};

exports.create_Attendance_details = () => {
  // Ensure you're using the correct database before creating the table
connection.query(
    "CREATE TABLE IF NOT EXISTS Attendance_details (Subject_Name varchar(200) not null, Subject_Code VARCHAR(300) NOT NULL, Session VARCHAR(100) NOT NULL, Year VARCHAR(100) not null, Semester_Type varchar(100)  not null, Class_Type varchar(200) not null,Teacher_Name varchar(200) not null,Teacher_Registration_Id varchar(200) not null, Department varchar(200) not null,Attendance_id int primary key AUTO_INCREMENT,Comment varchar(3000) not null, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, Period varchar(200) not null, Section varchar(200) not null,Total_Attendance  VARCHAR(100) not null,Classroom_id varchar(200) not null,Date_ varchar(200) not null, FOREIGN KEY (Classroom_id) REFERENCES Class_Room(Classroom_id))",
    (err, results) => {
        if (err) {
            console.error("Error creating table:", err.stack);
            return;
        }
        console.log("Table created or already exists: Attendance_details");
    }
);
};
exports.generate_attendance = () => {
  connection.query(
    "CREATE TABLE IF NOT EXISTS Generate_report (Teacher_Registrtaion_Id varchar(255) NOT NULL,Total_Attendance JSON NOT NULL,Total_Students VARCHAR(200) NOT NULL,AVG_Day varchar(200) not null,Day_Id int primary key AUTO_INCREMENT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,Req_start varchar(200) not null,Req_end varchar(200) not null,Month  JSON NOT NULL,Year  JSON NOT NULL,Day_no varchar(200) not null,Average_percent varchar(200) not null)",
    (err, result) => {
      if (err) {
        console.error("Error creating table:", err.stack);
        return;
      }
      console.log("Table created or already exists:  Generate_report");
    }
  );
};
