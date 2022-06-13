const User = require('../models/User');

const authAdmin = async (req, res, next) => {
    try {
    const user = await User.findOne({_id: req.user.id})    
     
     if(user.role !== 1) 
     return res.status(500).json({msg:"admin resources has been denied"})

     next();      
    } catch (err) {
        return res.status(500).json({msg:err.message})

    }



}

module.exports = authAdmin