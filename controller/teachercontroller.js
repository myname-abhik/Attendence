const authenticate = require('../model/authenticate');

exports.viewTeacher = (req, res) => {
    authenticate.connection.query('SELECT * FROM faculty_registered_details', (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        res.json(rows);
    });
  
};
exports.viewAdmin = (req, res) => {
    authenticate.connection.query('SELECT * FROM admin_registered_details', (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

       
        res.json(rows);
    });
};

exports.viewClassroom = (req, res) => {
    authenticate.connection.query('SELECT * FROM class_room', (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        res.json(rows);
    });
  
};

exports.viewAttendence = (req, res) => {
    authenticate.connection.query('SELECT * FROM attendance_details', (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        res.json(rows);
    });
  
};



exports.createTeacher = (req, res) => {
    const {Full_Name, Email, Phone,Post,Department,Class_id} = req.body;

  
    if (!authenticate.connection) {
        return res.status(500).send('Database connection not established');
    }

    // Corrected SQL query
    const query = 'INSERT INTO `faculty_registered_details` (Full_Name, Email, Phone,Post,Department,Class_id) VALUES (?, ?, ?, ? ,? , ? )';

    authenticate.connection.query(query, [Full_Name, Email, Phone,Post,Department,Class_id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        res.status(201).json({
            message: 'Teacher created successfully',
            insertedId: results.insertId 
        });
    });
    
};

exports.createAdmin = (req, res) => {
    const {Full_Name,Email,Phone} = req.body;

   
    if (!authenticate.connection) {
        return res.status(500).send('Database connection not established');
    }

    // Corrected SQL query
    const query = 'INSERT INTO `admin_registered_details` (Full_Name,Email,Phone) VALUES (?, ?, ?)';

    authenticate.connection.query(query, [Full_Name,Email,Phone], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        
        res.status(201).json({
            message: 'admin created successfully',
            insertedId: results.insertId 
        });
    });
};

exports.createClassroom = (req, res) => {
    const {Subject_Name,Subject_Code,Session,Year,Semester_Type,Class_Type,Teacher_Name,Teacher_Registraion_Id,Department} = req.body;

   
    if (!authenticate.connection) {
        return res.status(500).send('Database connection not established');
    }

    // Corrected SQL query
    const query = 'INSERT INTO `class_room` (Subject_Name,Subject_Code,Session,Year,Semester_Type,Class_Type,Teacher_Name,Teacher_Registraion_Id,Department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    authenticate.connection.query(query, [Subject_Name,Subject_Code,Session,Year,Semester_Type,Class_Type,Teacher_Name,Teacher_Registraion_Id,Department], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        
        res.status(201).json({
            message: 'Class Room created successfully',
            insertedId: results.insertId 
        });
    });
};


exports.createAttendence = (req, res) => {
    const {Subject_Name,Subject_Code,Session,Year,Semester_Type,Class_Type,Teacher_Name,Teacher_Registraion_Id,Department,Comment,period ,section,Total_Attendance} = req.body;

   
    if (!authenticate.connection) {
        return res.status(500).send('Database connection not established');
    }

    // Corrected SQL query
    const query = 'INSERT INTO `attendance_details` (Subject_Name,Subject_Code,Session,Year,Semester_Type,Class_Type,Teacher_Name,Teacher_Registraion_Id,Department,Comment, period ,section,Total_Attendance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)';

    authenticate.connection.query(query, [Subject_Name,Subject_Code,Session,Year,Semester_Type,Class_Type,Teacher_Name,Teacher_Registraion_Id,Department,Comment, period ,section,Total_Attendance], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        
        res.status(201).json({
            message: 'Attendece Taken',
            insertedId: results.insertId 
        });
    });
};









