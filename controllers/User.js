const User = require('../models/User');
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const sendEmail = require('../libs/sendMail');
const dotenv = require('dotenv');
dotenv.config();


const register = async (req,res) => {
   
 try {
     
    const {name, email, password} = req.body

    if(!name || !email || !password) 
       return res.status(400).json({msg: "please fill in all the fields."})

    if(!validateEmail(email))
      return res.status(400).json({msg:"Invalid emails"})
      
      const user = await User.findOne({email})
      if(user) return res.status(400).json({msg:"this email already exists"})
    
      if(password.length < 6 ) return res.status(400).json({msg:"password must be at least 6 characters."})

      const passwordHash = await bcryptjs.hash(password,12);

      const newUser = {
          name,email,password: passwordHash
      }
    const activation_token = createActivationToken(newUser);
   const url = `${process.env.CLIENT_URL}/user/activate/${activation_token}` 
   
   sendEmail(email,url,"vertify your email address")

   res.status(200).json({msg: "Register Success! please activate your email."})

 } catch (error) {
     res.status(500).json({msg:error.message})
 }


}

const activateEmail = async (req, res) => {
  
try {
  const {activation_token} = req.body;
  const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)  

  const {name,email,password} = user
  
  const check = await User.findOne({email})
  if(check) return res.status(400).json({msg:"This email already exists."})

  const newUser = new User({
   name,email,password

  })

  await newUser.save()

  res.status(200).json({msg:"Account has been activated"})


} catch (err) {
   return res.status(500).json({msg: err.message})
}

}

const login = async (req,res) => {
  
  try {
     const {email, password} = req.body;
     const user = await User.findOne({email})
     if(!user) return res.status(400).json({msg:"this email does not exist"})

     const isMatch = await bcryptjs.compare(password, user.password);

     if(!isMatch) return res.status(400).json({msg: "the password is in correct"})
     
     const refresh_token = createRefreshToken({id: user._id})
     res.cookie('refreshtoken',refresh_token, {
     httpOnly: true,
     path: '/user/refresh_token',
     maxAge: 7*24*60*1000 // 7days

     })

     res.status(200).json({msg: "login success!"})


  } catch (error) {
     return res.status(500).json({msg:error.message})
  }

}

const getAccessToken = (req,res) => {

   try {
      const rf_token = req.cookies.refreshtoken
      if(!rf_token) return res.status(400).json({msg: "Please login now!"})

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if(err) return res.status(400).json({msg: "Please login now!"})

          const access_token = createAccessToken({id: user.id})
          res.status(200).json({access_token})
      })
  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
}






function validateEmail(email) {
   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);

}

const createActivationToken = (payload) => {
   
   return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})

}

const createAccessToken = (payload) => {
 return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})

}
 
const createRefreshToken = (payload) => {
  
   return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})

}

const forgotPassword = async (req,res) => {
   try {
      const {email} = req.body
      const user = await Users.findOne({email})
      if(!user) return res.status(400).json({msg: "This email does not exist."})

      const access_token = createAccessToken({id: user._id})
      const url = `${CLIENT_URL}/user/reset/${access_token}`

      sendMail(email, url, "Reset your password")
      res.status(200).json({msg: "Re-send the password, please check your email."})
  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
}

const resetPassword = async (req,res) => {
   try {
      const {password} = req.body
      console.log(password)
      const passwordHash = await bcrypt.hash(password, 12)

      await Users.findOneAndUpdate({_id: req.user.id}, {
          password: passwordHash
      })

      res.status(200).json({msg: "Password successfully changed!"})
  } catch (err) {
      return res.status(500).json({msg: err.message})
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
 


module.exports = {register,activateEmail,login,getAccessToken,forgotPassword,updateUser,resetPassword,deleteUser,getAllUsers,logout,getUser}