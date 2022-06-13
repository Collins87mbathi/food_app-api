const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
   type: String,
   required:[true,"please enter yur full name"],
   trim : true   

  },
  email : {
      type:String,
      required : [true, "please enter email!"],
      trim:true,
  },
  
  password : {
      type:String,
      required : [true, "please enter password!"]
  },
  role: {
      type: Number,
      default:0 // 0 = user, 1 = admin
  },
  avatar : {
      type: String,
      default: "default.png"
  }
  


},
{timestamps:true}
)

module.exports = mongoose.model("User",userSchema);