const User = require('../models/User');
const bcryptjs = require("bcryptjs");
// const jwt = require('jsonwebtoken');
const sendEmail = require('../libs/sendMail');
const crypto = require('crypto');
const dotenv = require('dotenv');
const Token = require('../models/Token');
dotenv.config();


const register = async (req,res) => {
   
 try {
     
    const {name, email, password} = req.body;

    if(!name || !email || !password) 
       return res.status(400).json({msg: "please fill in all the fields."})

    if(!validateEmail(email))
      return res.status(400).json({msg:"Invalid emails"})
      
      let user = await User.findOne({email})
      if(user) return res.status(400).json({msg:"this email already exists"})
    
      if(password.length < 6 ) return res.status(400).json({msg:"password must be at least 6 characters."})

      const passwordHash = await bcryptjs.hash(password,12);

      user = await new User({
          name,email,password: passwordHash
      }).save();

      const token = await new Token({
         userId : user._id,
         token:crypto.randomBytes(32).toString("hex"),
      }).save();

   //  const activation_token = createActivationToken(newUser);
   const url = `https://perezfoods.netlify.app/#/users/${user.id}/verify/${token.token}`;
   
   sendEmail(email,url,"vertify your email address");

   res.status(200).json({msg: "Register Success! please activate your email."})

 } catch (error) {
     res.status(500).json({error})
     console.log(error);
 }


}

const activateEmail = async (req, res) => {
  
try {
   const user = await User.findOne({ _id: req.params.id });
   if (!user) return res.status(400).send({ message: "Invalid link" });

   const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
   });
   if (!token) return res.status(400).send({ message: "Invalid link" });

   await User.updateOne({ _id: user._id }, { verified: true });
   await token.remove();

   res.status(200).send({ msg: "Email verified successfully" });
} catch (err) {
   console.log(err);
   return res.status(500).send({msg: err.message})
  
}

}

const login = async (req,res) => {
  
  try {
     const {email, password} = req.body;
     if(!email || !password) 
     return res.status(400).send({msg: "please fill in all the fields."})
     
     if(!validatePassword(password)) {
      return res.status(400).send({msg: "password must contain atleast one upper case and a number"})
      }
     const user = await User.findOne({email})
     if(!user) return res.status(400).send({msg:"this email does not exist"})

     const isMatch = await bcryptjs.compare(password, user.password);

     if(!isMatch) return res.status(400).send({msg: "the password is incorrect"})

   if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
         token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
         }).save();
         const url = `https://perezfoods.netlify.app/#/users/${user._id}/verify/${token.token}`;
         sendEmail(email,url,"vertify your email address");
      }

      return res
         .status(400)
         .send({ msg: "An Email sent to your account please verify" });
   }

     res.status(200).json({user, msg: "login success!"})


  } catch (error) {
   console.log(error);
    res.status(500).json({error})
    
  }

}

// const getAccessToken = (req,res) => {

//    try {
//       const rf_token = req.cookies.refreshtoken
//       if(!rf_token) return res.status(400).json({msg: "Please login now!"})

//       jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//           if(err) return res.status(400).json({msg: "Please login now!"})

//           const access_token = createAccessToken({id: user.id})
//           res.status(200).json({access_token})
//       })
//   } catch (err) {
//       return res.status(500).json({msg: err.message})
//   }
// }



function validatePassword(password) {
   const re =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
   return re.test(password);
}


function validateEmail(email) {
   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);

}

// const createActivationToken = (payload) => {
   
//    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '20days'})

// }

// const createAccessToken = (payload) => {
//  return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})

// }
 
// const createRefreshToken = (payload) => {
  
//    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})

// }

//post email for sending reset
const forgotPassword = async (req,res) => {
   try {
   
		let  user = await User.findOne({ "email": req.body.email});
		if (!user)
			return res
				.status(409)
				.send({ message: "User with given email does not exist!" });

		let token = await Token.findOne({ userId: user._id });
		if (!token) {
			token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		const url =`https://perezfoods.netlify.app/#/password-reset/${user._id}/verify/${token.token}`;
		await sendEmail(user.email,url, "Reset Password");

		res
			.status(200)
			.send({ message: "Password reset link sent to your email account" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
}


//post email for sending reset

const resetPassword = async (req,res) => {
   try {
      // const {password} = req.body
      // console.log(password)
    const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		if (!user.verified) user.verified = true;

      const passwordHash = await bcrypt.hash(req.body.password, 12);

		user.password =  passwordHash;
		await user.save();
		await token.remove();

		res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
   res.status(500).send({ message: error});
   console.log(error);
  }  

}

//clicking the link 

const VertifyPassword = async (req,res) => {
   try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		res.status(200).send("Valid Url");
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
}


const getAllUsers = async (req,res)=> {
   try {
      const users = await User.find().select("-password");
      res.status(200).json(users)
   } catch (error) {
      res.status(500).json({msg: error.message})
   }
}

const updateUser = async (req,res) => {
   try {
      await Users.findOneAndUpdate({_id: req.user.id}, {
         name, avatar
     })

     res.json({msg: "Update Success!"})
   } catch (error) {
      return res.status(500).json({msg: error.message})
   }
}

const deleteUser = async (req,res) => {
   try {
      await User.findByIdAndDelete(req.params.id)
      res.status(200).json({msg:"user deleted successfully"})
   } catch (error) {

      return res.status(500).json({msg: error.message})
   }
}

const logout = async (req,res) => {

   try {
      res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
      return res.json({msg: "Logged out."})
  } catch (err) {
      return res.status(500).json({msg: err.message})
  }

}

const getUser = async (req,res)=> {

 try {
   const user = await User.findById(req.params.id)
   res.status(200).json(user);
 } catch (error) {
    return res.status(500).json({msg:error.message})
 }

}
 


module.exports = {register,activateEmail,login,forgotPassword,updateUser,resetPassword,deleteUser,getAllUsers,logout,getUser,VertifyPassword}