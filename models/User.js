const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

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
  },
  verified: {
    type:Boolean,
    default:false
}
  
},
{timestamps:true}
)


userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.ACTIVATION_TOKEN_SECRET, {
		expiresIn: "7d",
	});
	return token;
};

module.exports = mongoose.model("User",userSchema);