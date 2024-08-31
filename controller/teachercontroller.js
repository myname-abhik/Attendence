const authenticate = require('../model/authenticate');
const uuid = require('uuid');
const mongodb_database = require('../model/mongo')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')


exports.viewTeacher = (req, res) => {
    authenticate.connection.query('SELECT * FROM faculty_registered_details', (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        res.json(rows);
    });
  
};

exports.viewTeacher_id = (req, res) => {
    const {Teacher_Registration_Id} = req.body
    authenticate.connection.query('SELECT * FROM faculty_registered_details WHERE Teacher_Registraion_Id =?', [Teacher_Registration_Id], (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }
        res.status(201).json(rows);
    })
}
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
exports.Classroom_find = (req, res) => {
    const {Teacher_Registraion_Id} = req.body
    authenticate.connection.query('SELECT * FROM class_room WHERE Teacher_Registraion_Id =?', [Teacher_Registraion_Id], (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }
        console.log(req.body);
        res.status(201).json(rows);
    })
}

exports.viewAttendence = (req, res) => {
    authenticate.connection.query('SELECT * FROM attendance_details', (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        res.json(rows);
    });
  
};




exports.createTeacher = async(req, res) => {
    const {Full_Name,Email,Phone,Post,Department} = req.body;
    const 	Teacher_Registraion_Id= uuid.v4(3);
  
    if (!authenticate.connection) {
        return res.status(500).send('Database connection not established');
    }

    // Corrected SQL query
    const query = 'INSERT INTO `faculty_registered_details` (Full_Name, Email, Phone,Post,Department,Teacher_Registraion_Id) VALUES (?, ?, ?, ? ,? , ? )';

    authenticate.connection.query(query, [Full_Name, Email, Phone,Post,Department,Teacher_Registraion_Id], (err, results) => {
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



exports.createTeacher_mongodb = async(req, res) => {
    try {
    const {Full_Name,Email,Phone,Post,Department,Password} = req.body;
    const 	Teacher_Registration_Id= uuid.v4(3);
    const user_exist = await mongodb_database.teacher_login.findOne({Email})
     if(user_exist)
        {
            res.status(401).send('Teacher already exists');
        }

         const hashpassword  = await bcrypt.hash(Password, 10)
        //  console.log(hashpassword)
      const teacher =   await mongodb_database.teacher_login.create({Full_Name,Email,Phone,
        Post,Department,Teacher_Registration_Id,
        Password:hashpassword,
        Password_visible: Password

         })
       const token =   jwt.sign(
            {id: teacher._id,Full_Name,Email,Post,Department},
            'shhhh',
            {
                expiresIn: '90 days'
            }

        )
        // teacher.token = token
        teacher.Password = undefined
        const options = {
            expires:new Date(Date.now()+ 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }
        res.status(200).cookie("token", token, options).json({
            success: true,
            token: token,
            teacher
        });
        }

    catch(error)
    {
        console.log(error)
        res.status(500).send('Server Error')
    }
   
    }


exports.login_Teacher_mongodb = async (req, res) => {
    
try {
 const {Email,Password} = req.body
 if(!(Email && Password))
 {
    res.status(400).send('Please provide Email and Password')
 }
 const teacher =  await  mongodb_database.teacher_login.findOne({Email}) 
 if(!teacher)
 {
    res.status(400).send('Teacher not exists');
 }
 if(teacher&&(await bcrypt.compare(Password, teacher.Password)))
 {
    const token =   jwt.sign(
        {id: teacher._id,
        Full_Name: teacher.Full_Name,
        Email: teacher.Email,
        Post: teacher.Post,
        Department: teacher.Department
    },
        'shhhh',
        {
            expiresIn: '90 days',
        }
    )
 
    // teacher.token = token;
    teacher.Password = undefined;
    //cookie section
    const options = {
        expires:new Date(Date.now()+ 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
    res.status(200).cookie("token", token, options).json({
        success: true,
        token: token,
        teacher
    });
 }


} catch (error) {
    console.log(error);
    
}

};






