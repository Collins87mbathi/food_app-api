const router = require('express').Router();
//const authAdmin = require('../middlewares/authAdmin');
//const auth = require('../middleware/auth');


const {createProducts,getProducts,deleteProducts,updateProducts} = require('../controllers/Product');


router.post('/',createProducts);
router.get('/all',getProducts);
router.delete('/:id',deleteProducts);
router.put('/:id',updateProducts);


module.exports = router;