const router = require('express').Router();
//const authAdmin = require('../middlewares/authAdmin');
//const auth = require('../middleware/auth');


const {createProducts,getProduct, getProducts,deleteProducts,updateProducts} = require('../controllers/Product');


router.post('/',createProducts);
router.get('/all',getProducts);
router.delete('/:id',deleteProducts);
router.put('/:id',updateProducts);
router.get('/:id',getProduct);



module.exports = router;