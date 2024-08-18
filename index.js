
const express = require('express');
const app = express();
require('dotenv').config();
const bodyparser = require('body-parser');
const mysql = require('mysql');
const teacher = require('./routes/user');
const mongoose = require('mongoose');
const mongo_connect = require('./model/mongo_connect')
const mongo = require('./model/mongo');


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
const authenticate = require('./model/authenticate');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// const createSchema = require('./model/authenticate')
authenticate.connect();
mongo_connect.mogodb_connect();
mongo.mongo_create_schema();
authenticate.create_Faculty_registered_details();
authenticate.create_Admin_registered_details();
authenticate.create_Classs_room();
authenticate.create_Attendance_details();
app.use('/portal', teacher)



