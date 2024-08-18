const mongoose = require('mongoose')
exports.mogodb_connect = ()=>{mongoose.connect(`mongodb+srv://abhik16chakrabortty:1214@cluster0.rwp58am.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log('Connected to MongoDB');
  })
  .catch((err)=>{  
    console.log('Error connecting to MongoDB',err);
  })
}