const router = require('express').Router()
//const authAdmin = require('../middlewares/authAdmin');
//const auth = require('../middlewares/auth');
const {createCategory,deleteCategory,getCategory,updateCategory} = require('../controllers/Category');


router.post('/',createCategory);
router.get('/all',getCategory);
router.delete('/:id',deleteCategory);
router.put('/:id',updateCategory);

module.exports = router;