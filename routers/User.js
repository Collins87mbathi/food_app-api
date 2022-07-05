const router = require('express').Router()
const  {login,logout,register,resetPassword,forgotPassword,getUser,getAllUsers,activateEmail,updateUser,deleteUser, VertifyPassword} = require('../controllers/User');
// const authAdmin = require('../middlewares/authAdmin');
// const auth = require('../middlewares/auth');


router.post('/register',register);
router.get('/:id/verify/:token',activateEmail);
router.post('/login',login);
// router.post('/refresh',getAccessToken);
router.post('/forgot',forgotPassword);
// router.post('/reset',auth,resetPassword);
router.get('/information',getUser);
router.get('/all_information',getAllUsers);
router.get('/logout',logout);
router.patch('/update',updateUser);
router.delete('/delete/:id',deleteUser);
router.get('/:id/:token',VertifyPassword);
router.post('/:id/:token',resetPassword);
router.post('/password-reset',forgotPassword);

module.exports = router;