const authenticate = require("../model/authenticate");
const uuid = require("uuid");
const mongodb_database = require("../model/mongo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const { parseISO, format } = require("date-fns");

exports.viewTeacher = (req, res) => {
  authenticate.connection.query(
    "SELECT * FROM faculty_registered_details",
    (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }

      res.json(rows);
    }
  );
};

exports.viewTeacher_id = (req, res) => {
  const { Teacher_Registration_Id } = req.body;
  authenticate.connection.query(
    "SELECT * FROM faculty_registered_details WHERE Teacher_Registraion_Id =?",
    [Teacher_Registration_Id],
    (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }
      res.status(201).json(rows);
    }
  );
};
exports.viewAdmin = (req, res) => {
  authenticate.connection.query(
    "SELECT * FROM admin_registered_details",
    (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }

      res.json(rows);
    }
  );
};

exports.adminLogin = (req, res) => {
    const { Email, Password} = req.body;
    authenticate.connection.query(
        "SELECT * FROM Admin_registered_details WHERE Email = ?",
        [Email],
        async (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).send("Server error");
            }
            if (results.length === 0) {
                return res.status(401).send("Email not found");
            }
            if (Password === results[0].Password) {
                res.status(200).json({ message: "Login successfully", data: results });
            } else {
                res.status(401).send("Password not match");
            }
        }
    );
};

exports.viewClassroom = (req, res) => {
  authenticate.connection.query("SELECT * FROM Class_Room", (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Server error");
    }

    res.json(rows);
  });
};
exports.Classroom_find = (req, res) => {
  const { Teacher_Registration_Id } = req.body;
  authenticate.connection.query(
    "SELECT * FROM Class_Room WHERE Teacher_Registration_Id =?",
    [Teacher_Registration_Id],
    (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }
      console.log(req.body);
      res.status(201).json(rows);
    }
  );
};
exports.Attendence_find = (req, res) => {
  const { Classroom_id } = req.body;
  authenticate.connection.query(
    "SELECT * FROM Attendance_details WHERE Classroom_id = ?",
    [Classroom_id],
    (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }
      console.log(req.body);
      res.status(201).json(rows);
    }
  );
};

exports.viewAttendence = (req, res) => {
  authenticate.connection.query(
    "SELECT * FROM Attendance_details",
    (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }

      res.json(rows);
    }
  );
};

exports.createTeacher = async (req, res) => {
  const { Full_Name, Email, Phone, Post, Department } = req.body;
  const Teacher_Registraion_Id = uuid.v4(3);

  if (!authenticate.connection) {
    return res.status(500).send("Database connection not established");
  }

  // Corrected SQL query
  const query =
    "INSERT INTO `faculty_registered_details` (Full_Name, Email, Phone,Post,Department,Teacher_Registraion_Id) VALUES (?, ?, ?, ? ,? , ? )";

  authenticate.connection.query(
    query,
    [Full_Name, Email, Phone, Post, Department, Teacher_Registraion_Id],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }

      res.status(201).json({
        message: "Teacher created successfully",
        insertedId: results.insertId,
      });
    }
  );
};

exports.createAdmin = (req, res) => {
  const { Full_Name, Email, Phone } = req.body;

  if (!authenticate.connection) {
    return res.status(500).send("Database connection not established");
  }

  // Corrected SQL query
  const query =
    "INSERT INTO `admin_registered_details` (Full_Name,Email,Phone) VALUES (?, ?, ?)";

  authenticate.connection.query(
    query,
    [Full_Name, Email, Phone],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }

      res.status(201).json({
        message: "admin created successfully",
        insertedId: results.insertId,
      });
    }
  );
};

exports.createClassroom = async (req, res) => {
  const {
    Subject_Name,
    Subject_Code,
    Session,
    Year,
    Semester_Type,
    Class_Type,
    Teacher_Name,
    Email,
    Department,
    Section,
    Semester,
    Total_Students,
  } = req.body;
  const teacher = await mongodb_database.teacher_login.findOne({ Email });
  const Classroom_id = uuid.v4().toString();

  if (!authenticate.connection) {
    return res.status(500).send("Database connection not established");
  }
  console.log(teacher._id.toString());
  // Corrected SQL query
  const query =
    "INSERT INTO `Class_Room` (Subject_Name,Subject_Code,Session,Year,Semester_Type,Class_Type,Teacher_Name,Teacher_Registration_Id,Department,Section,Semester,Total_Students,Classroom_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  authenticate.connection.query(
    query,
    [
      Subject_Name,
      Subject_Code,
      Session,
      Year,
      Semester_Type,
      Class_Type,
      Teacher_Name,
      teacher._id.toString(),
      Department,
      Section,
      Semester,
      Total_Students,
      Classroom_id,
    ],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }

      res.status(201).json({
        message: "Class Room created successfully",
        insertedId: results.insertId,
      });
    }
  );
};

exports.createAttendence = async (req, res) => {
  const {
    Subject_Name,
    Subject_Code,
    Session,
    Year,
    Semester_Type,
    Class_Type,
    Teacher_Name,
    Email,
    Department,
    Comment,
    Period,
    Section,
    Total_Attendance,
    Classroom_id,
    Date_,
  } = req.body;
  const teacher = await mongodb_database.teacher_login.findOne({ Email });

  if (!authenticate.connection) {
    return res.status(500).send("Database connection not established");
  }

  // Corrected SQL query
  const query =
    "INSERT INTO `Attendance_details` (Subject_Name,Subject_Code,Session,Year,Semester_Type,Class_Type,Teacher_Name,Teacher_Registration_Id,Department,Comment, Period ,Section,Total_Attendance,Classroom_id,Date_) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?)";

  authenticate.connection.query(
    query,
    [
      Subject_Name,
      Subject_Code,
      Session,
      Year,
      Semester_Type,
      Class_Type,
      Teacher_Name,
      teacher._id.toString(),
      Department,
      Comment,
      Period.replace(/\s+/g, ""),
      Section,
      Total_Attendance,
      Classroom_id,
      Date_,
    ],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Server error");
      }

      res.status(201).json({
        message: "Attendece Taken",
        insertedId: results.insertId,
      });
    }
  );
};

exports.createTeacher_mongodb = async (req, res) => {
  try {
    const { Full_Name, Email, Phone, Post, Department, Password } = req.body;
    // const 	Teacher_Registration_Id= uuid.v4(3);
    const user_exist = await mongodb_database.teacher_login.findOne({ Email });
    if (user_exist) {
      res.status(401).send("Teacher already exists");
    }

    const hashpassword = await bcrypt.hash(Password, 10);
    //  console.log(hashpassword)
    const teacher = await mongodb_database.teacher_login.create({
      Full_Name,
      Email,
      Phone,
      Post,
      Department,
      Password: hashpassword,
      Password_visible: Password,
    });
    console.log("teacher", teacher);

    const token = jwt.sign(
      { id: teacher._id, Full_Name, Email, Post, Department },
      "shhhh",
      {
        expiresIn: "90 days",
      }
    );
    // teacher.token = token
    teacher.Password = undefined;
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      success: true,
      token: token,
      teacher,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.login_Teacher_mongodb = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!(Email && Password)) {
      res.status(400).send("Please provide Email and Password");
    }
    const teacher = await mongodb_database.teacher_login.findOne({ Email });
    if (!teacher) {
      res.status(400).send("Teacher not exists");
    }
    if (teacher && (await bcrypt.compare(Password, teacher.Password))) {
      const token = jwt.sign(
        {
          id: teacher._id,
          Full_Name: teacher.Full_Name,
          Email: teacher.Email,
          Post: teacher.Post,
          Department: teacher.Department,
        },
        "shhhh",
        {
          expiresIn: "90 days",
        }
      );

      // teacher.token = token;
      teacher.Password = undefined;
      //cookie section
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.status(200).cookie("token", token, options).json({
        success: true,
        token: token,
        teacher,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.reportgenerate = (req, res) => {
  try {
    const { Teacher_Registration_Id, Classroom_id, startDate, endDate } =
      req.body;
    const [year, month, day] = endDate.split("-");

    const endDateNew = `${year}-${month}-${parseInt(day) + 1}`;
    console.log(endDateNew);
    const query =
      "SELECT Total_Attendance,Teacher_Name,Date_,created_at, Subject_Name FROM `Attendance_details` WHERE Teacher_Registration_Id = ? and Classroom_id = ? and created_at >= ? AND created_at <= ? ";
    const classRoomQuery = `SELECT Total_Students FROM Class_Room WHERE Classroom_id = ?`;
    authenticate.connection.query(
      query,
      [Teacher_Registration_Id, Classroom_id, startDate, endDateNew],
      (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ error: err });
        }
        if (results.length === 0) {
          res.status(404).json({ message: "No record found" });
          return;
        }
        authenticate.connection.query(
          classRoomQuery,
          [Classroom_id],
          (err, classRoomResults) => {
            if (err) {
              console.error("Error executing query:", err);
              res.status(500).json({ error: err });
            }

            const Total_Attendance_date = results
              .map((record) => parseInt(record.Total_Attendance))
              .reduce((sum, value) => sum + value, 0);
            const average_Attendance = Total_Attendance_date / results.length;
            const average_percent =
              (average_Attendance / classRoomResults[0].Total_Students) * 100;
            const month = [];
            const Total_Attendance = [];
            const year = [];
            results.forEach((entry) => {
              //    const date = parseISO(entry.created_at);
              //    console.log(entry.created_at);
              month.push(format(entry.created_at, "MMMM"));
              Total_Attendance.push(entry.Total_Attendance);
              let date = new Date(entry.created_at);
              year.push(date.getUTCFullYear());
              //   console.log(month)
            });
            console.log(month, Total_Attendance, year);
            const Report_Generated_AtQuery = `Insert into Generate_report (Teacher_Registrtaion_Id,Total_Attendance,Total_Students,AVG_Day,Req_start,Req_end,Month,Year,Day_no,Average_percent)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

            authenticate.connection.query(
              Report_Generated_AtQuery,
              [
                Teacher_Registration_Id,
                JSON.stringify(Total_Attendance),
                classRoomResults[0].Total_Students,
                average_Attendance,
                startDate,
                endDate,
                JSON.stringify(month),
                JSON.stringify(year),
                results.length,
                `${average_percent}%`,
              ],
              (err, getreport) => {
                if (err) {
                  console.error("Error executing query:", err);
                  res.status(500).json({ error: err });
                }
                res.json({
                  Main_info: results,
                  Total_Student: classRoomResults,
                  Days: results.length,
                  Total_Attendance_date: Total_Attendance_date,
                  Average_Attendance: `${average_Attendance}`,
                  Average_percent: `${average_percent}%`,
                  Rport: getreport,
                  Report_Generated_At: new Date(),
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(501).send("Server Error");
  }
};
// SELECT Total_Attendance,Teacher_Name,Date_, Subject_Name FROM `Attendance_details` WHERE Teacher_Registration_Id = '66ed7defe9784242cb48acc0' and Classroom_id = '8103976e-c3b4-42d8-ad84-2b606b7eae57' and created_at >= '2024-09-20' AND created_at < '2024-09-22';

exports.get_reportgenerate = (req, res) => {
  const query = "SELECT * FROM Generate_report";
  authenticate.connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: err });
    }
    res.json({ report: results });
  });
};

exports.get_reportgenerate_id = (req, res) => {
  const {
    id,
    starting_date,
    ending_date,
    subject_code,
    department,
    session,
    year,
    sort_by,
  } = req.body;
  let inputArray = [id];
  let data = [];
  let responseData = [];

  let query =
    "SELECT * FROM Attendance_details as a INNER JOIN Class_Room as c ON a.Classroom_id = c.Classroom_id WHERE a.Teacher_Registration_Id = ?";

  if (subject_code !== "" && subject_code !== "All") {
    query += " AND a.Subject_Code = ?";
    inputArray.push(subject_code);
  }
  if (department !== "" && department !== "All") {
    query += " AND c.Department = ?";
    inputArray.push(department);
  }
  if (session !== "" && session !== "All") {
    query += " AND c.Session = ?";
    inputArray.push(session);
  }
  if (year !== "" && year !== "All") {
    query += " AND c.Year = ?";
    inputArray.push(year);
  }

  authenticate.connection.query(query, inputArray, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      res.status(200).json({ message: "No record found" });
      return;
    }

    if (starting_date && ending_date) {
      data = results.filter(
        (record) => record.Date_ >= starting_date && record.Date_ <= ending_date
      );
      // console.log(data);
    }

    data.forEach((record) => {
      responseData.push({
        Session: record.Session,
        Date: dayjs(record.Date_).format("DD/MM/YY"),
        "Faculty Name": record.Teacher_Name,
        Department: record.Department,
        Section: record.Section,
        Semester: record.Semester,
        "Subject Code": record.Subject_Code,
        "Subject Name": record.Subject_Name,
        "Subject Type": record.Class_Type,
        Period: record.Period,
        "Student Count": record.Total_Attendance,
        "Total Students": record.Total_Students,
        Percentage: `${(
          (record.Total_Attendance / record.Total_Students) *
          100
        ).toFixed(2)}%`,
        Comment: record.Comment,
      });
    });

    if (sort_by === "Date" || sort_by === "")
      res.status(200).json(returnRowColumnFromData(responseData));
    else if (sort_by === "Month") {
      let data = responseData.reduce((r, a) => {
        let [day, month, year] = a.Date.split("/");
        let key = `${month}/${year}`;
        if (!r[key]) {
          r[key] = {
            ...a,
            Month: month,
            Year: `20${year}`,
            Percentage: parseFloat(a.Percentage),
            Count: 1,
          };
          delete r[key]["Date"];
        } else {
          r[key]["Percentage"] += parseFloat(a.Percentage);
          r[key]["Count"] += 1;
        }
        return r;
      }, Object.create(null));

      data = Object.values(data).map((item) => {
        item["Percentage"] = `${(item["Percentage"] / item["Count"]).toFixed(
          2
        )}%`;
        delete item["Count"];
        delete item["Student Count"];
        return item;
      });
      res.status(200).json(returnRowColumnFromData(data));
    } else if (sort_by === "Year") {
      let data = responseData.reduce((r, a) => {
        let [day, month, year] = a.Date.split("/");
        let key = `${year}`;
        if (!r[key]) {
          r[key] = {
            ...a,
            Year: `20${year}`,
            Percentage: parseFloat(a.Percentage),
            Count: 1,
          };
          delete r[key]["Date"];
        } else {
          r[key]["Percentage"] += parseFloat(a.Percentage);
          r[key]["Count"] += 1;
        }
        return r;
      }, Object.create(null));

      data = Object.values(data).map((item) => {
        item["Percentage"] = `${(item["Percentage"] / item["Count"]).toFixed(
          2
        )}%`;
        delete item["Count"];
        delete item["Student Count"];
        return item;
      });
      res.status(200).json(returnRowColumnFromData(data));
    }
  });
};

exports.get_reportgenerate_id_admin = (req, res) => {
  const {
    teacher_id,
    starting_date,
    ending_date,
    subject_code,
    department,
    session,
    year,
    sort_by,
  } = req.body;
  let inputArray = [];
  let data = [];
  let responseData = [];

  let query =
    "SELECT * FROM Attendance_details as a INNER JOIN Class_Room as c ON a.Classroom_id = c.Classroom_id WHERE 1=1";

  if (teacher_id !== "" && teacher_id !== "All") {
    query += " AND a.Teacher_Registration_Id = ?";
    inputArray.push(teacher_id);
  }
  if (subject_code !== "" && subject_code !== "All") {
    query += " AND a.Subject_Code = ?";
    inputArray.push(subject_code);
  }
  if (department !== "" && department !== "All") {
    query += " AND c.Department = ?";
    inputArray.push(department);
  }
  if (session !== "" && session !== "All") {
    query += " AND c.Session = ?";
    inputArray.push(session);
  }
  if (year !== "" && year !== "All") {
    query += " AND c.Year = ?";
    inputArray.push(year);
  }

  // console.log('query',query);

  authenticate.connection.query(query, inputArray, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      res.status(200).json({ message: "No record found" });
      return;
    }

    if (starting_date && ending_date) {
      data = results.filter(
        (record) => record.Date_ >= starting_date && record.Date_ <= ending_date
      );
      // console.log('Data:',data);
    } else {
      data = results;
    }

    data.forEach((record) => {
      const createdAt = record.created_at; // Example SQL timestamp
      const dateObject = new Date(createdAt);
      const date = dateObject.toLocaleDateString(); // Get date (e.g., "11/24/2024")
      const time = dateObject.toLocaleTimeString(); // Get time (e.g., "12:34:56 PM")
    //   console.log(`Date: ${date}, Time: ${time}`);

      responseData.push({
        Session: record.Session,
        Date: dayjs(record.Date_).format("DD/MM/YY"),
        "Actual Date": date,
        "Actual Time": time,
        "Faculty Name": record.Teacher_Name,
        Department: record.Department,
        Section: record.Section,
        Semester: record.Semester,
        "Subject Code": record.Subject_Code,
        "Subject Name": record.Subject_Name,
        "Subject Type": record.Class_Type,
        Period: record.Period,
        "Student Count": record.Total_Attendance,
        "Total Students": record.Total_Students,
        Percentage: `${(
          (record.Total_Attendance / record.Total_Students) *
          100
        ).toFixed(2)}%`,
        Comment: record.Comment,
      });
    });

    if (sort_by === "Date" || sort_by === "") {
      // console.log('responseData',responseData);
      // res.status(200).json(responseData);
      res.status(200).json(returnRowColumnFromData(responseData));
    } else if (sort_by === "Month") {
      let data = responseData.reduce((r, a) => {
        let [day, month, year] = a.Date.split("/");
        let key = `${month}/${year}`;
        if (!r[key]) {
          r[key] = {
            ...a,
            Month: month,
            Year: `20${year}`,
            Percentage: parseFloat(a.Percentage),
            Count: 1,
          };
          delete r[key]["Date"];
        } else {
          r[key]["Percentage"] += parseFloat(a.Percentage);
          r[key]["Count"] += 1;
        }
        return r;
      }, Object.create(null));

      data = Object.values(data).map((item) => {
        item["Percentage"] = `${(item["Percentage"] / item["Count"]).toFixed(
          2
        )}%`;
        delete item["Count"];
        delete item["Student Count"];
        return item;
      });
      res.status(200).json(returnRowColumnFromData(data));
    } else if (sort_by === "Year") {
      let data = responseData.reduce((r, a) => {
        let [day, month, year] = a.Date.split("/");
        let key = `${year}`;
        if (!r[key]) {
          r[key] = {
            ...a,
            Year: `20${year}`,
            Percentage: parseFloat(a.Percentage),
            Count: 1,
          };
          delete r[key]["Date"];
        } else {
          r[key]["Percentage"] += parseFloat(a.Percentage);
          r[key]["Count"] += 1;
        }
        return r;
      }, Object.create(null));

      data = Object.values(data).map((item) => {
        item["Percentage"] = `${(item["Percentage"] / item["Count"]).toFixed(
          2
        )}%`;
        delete item["Count"];
        delete item["Student Count"];
        return item;
      });
      res.status(200).json(returnRowColumnFromData(data));
    }
  });
};

const returnRowColumnFromData = (data) => {
  if (!Array.isArray(data)) {
    return;
  }

  const keys = {};
  const values = [];

  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!keys[key]) {
        keys[key] = [];
      }
      keys[key].push(item[key]);
    });
  });

  return { keys: Object.keys(keys), data };
};
