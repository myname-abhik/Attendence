const mongoose = require('mongoose')
let teacher_login;
exports.mongo_create_schema = () => {
const userSchema = new mongoose.Schema({
       "Full_Name": {
            "type": "string",
            "required": true
        },
        "Email": {
            "type": "string",
            "required": true,
            "unique": true
        },
        "Phone": {
            "type": "string",
            "required": true
        },
        "Department": {
            "type": "string",
            "required": true
        },
        "Password": {
            "type": "string",
            "unique": false
        },
        "Post": {
            "type": "string",
            "default": null
        },
        "Password_visible": {
            "type": "string",
            "unique": false
        },
        "token": {
            "type": "string",
            "default": null
        },
        // "Teacher_Registration_Id": {
        //     "type": "string",
        //     "default": null
        // }
    
    
});
// teacher_login =   mongoose.model('Teacher_attendence',userSchema)

exports.teacher_login = mongoose.model('Teacher_attendence',userSchema)
}
