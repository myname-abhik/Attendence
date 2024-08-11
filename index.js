
const express = require('express');
const app = express();
require('dotenv').config();
const bodyparser = require('body-parser');
const mysql = require('mysql');
const teacher = require('./routes/user');

const port = process.env.PORT ||5000
app.use(express.urlencoded({extended:false}));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.json());

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) =>{
    res.send('Hello World!')
})
app.listen(port,() => {
   console.log(`App listening on ${port}`);
})
const authenticate = require('./model/authenticate')
// const createSchema = require('./model/authenticate')
authenticate.connect();
authenticate.create_Faculty_registered_details();
authenticate.create_Admin_registered_details();
authenticate.create_Classs_room();
authenticate.create_Attendance_details();
app.use('/portal', teacher)



