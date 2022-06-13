const router = require('express').Router()
const  {login,logout,register,resetPassword,forgotPassword,getAccessToken,getUser,getAllUsers,activateEmail,updateUser,deleteUser} = require('../controllers/User');
const authAdmin = require('../middlewares/authAdmin');
const auth = require('../middlewares/auth');


router.post('/register',register);
router.post('/activation',activateEmail);
router.post('/login',login);
router.post('/refresh',getAccessToken);
router.post('/forgot',forgotPassword);
router.post('/reset',auth,resetPassword);
router.get('/information',auth,getUser);
router.get('all_information',auth,authAdmin,getAllUsers);
router.get('/logout',logout);
router.patch('/update',auth,updateUser);
router.delete('/delete/:id',auth,authAdmin,deleteUser);


module.exports = router;