const mongoose = require('mongoose')
exports.mogodb_connect = ()=>{mongoose.connect(`${process.env.MONGO_URL}`)
.then(()=>{
    console.log('Connected to MongoDB');
    
  })
  .catch((err)=>{  
    console.log('Error connecting to MongoDB',err);
  })
}