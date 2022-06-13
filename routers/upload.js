const router = require('express').Router()
const upload = require('../middlewares/uploadImage');
const Uploader = require('../controllers/UploadController');
const auth = require('../middlewares/auth');

router.post('/upload_avatar',upload,auth, Uploader);

router.post('/post_product',upload, Uploader);

module.exports = router

