const mysql = require('mysql');


let connection = mysql.createConnection({
    host: 'bufcjkvksp2pbreurdjj-mysql.services.clever-cloud.com',
    user: 'uucj4pbekfznhp1w',
    password: 'R2J9gCkQ8ntXGEQrvdEG',
    database: 'bufcjkvksp2pbreurdjj'
});

exports.connect = ()=>{ 
    connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database');
});
}

exports.connection = connection;
exports.create_Faculty_registered_details = () => {
    // Ensure you're using the correct database before creating the table
    connection.query('CREATE TABLE IF NOT EXISTS Faculty_registered_details (reg_no INT PRIMARY KEY AUTO_INCREMENT,Full_Name VARCHAR(300) NOT NULL, Email VARCHAR(100) NOT NULL,Phone VARCHAR(10) NOT NULL,Post VARCHAR(100) NOT NULL,Department VARCHAR(200) NOT NULL,Teacher_Registraion_Id varchar(200) not null);', (err, results) => {
        if (err) {
            console.error('Error creating table:', err.stack);
            return;
        }
        console.log('Table created or already exists: Faculty_registered_details');
    });
};

exports.create_Admin_registered_details = () => {
    // Ensure you're using the correct database before creating the table
    connection.query('CREATE TABLE IF NOT EXISTS Admin_registered_details (reg_no INT PRIMARY KEY AUTO_INCREMENT, Full_Name VARCHAR(300) NOT NULL, Email VARCHAR(100) NOT NULL, Phone varchar(10) not null, Department varchar(200) not null, Teacher_Registraion_Id varchar(200) not null)', (err, results) => {
        if (err) {
            console.error('Error creating table:', err.stack);
            return;
        }
        console.log('Table created or already exists: Admin_registered_details');
    });
};

exports.create_Classs_room = () => {
    // Ensure you're using the correct database before creating the table
    connection.query('CREATE TABLE IF NOT EXISTS Class_Room (Subject_Name varchar(200) not null, Subject_Code VARCHAR(300) NOT NULL, Session VARCHAR(100) NOT NULL, Year VARCHAR(100) not null, Semester_Type varchar(100)  not null, Class_Type varchar(200) not null,Teacher_Name varchar(200) not null,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,Teacher_Registration_Id varchar(200) not null, Department varchar(200) not null,Classroom_id int primary key KEY AUTO_INCREMENT,Section varchar(200) not null, Semester varchar(200) not null, Total_Students varchar(200) not null)', (err, results) => {
        if (err) {
            console.error('Error creating table:', err.stack);
            return;
        }
        console.log('Table created or already exists: Classs_room');
    });
};

exports.create_Attendance_details = () => {
    // Ensure you're using the correct database before creating the table
    connection.query('CREATE TABLE IF NOT EXISTS Attendance_details (Subject_Name varchar(200) not null, Subject_Code VARCHAR(300) NOT NULL, Session VARCHAR(100) NOT NULL, Year int not null, Semester_Type varchar(100)  not null, Class_Type varchar(200) not null,Teacher_Name varchar(200) not null,Teacher_Registration_Id varchar(200) not null, Department varchar(200) not null,Attendance_id int primary key KEY AUTO_INCREMENT,Comment varchar(3000) not null, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, Period varchar(200) not null, Section varchar(200) not null,Total_Attendance  int not null)', (err, results) => {
        if (err) {
            console.error('Error creating table:', err.stack);
            return;
        }
        console.log('Table created or already exists: Attendance_details');
    });
};