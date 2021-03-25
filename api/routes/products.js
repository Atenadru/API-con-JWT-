const express = require('express')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleweare/check-auth')

const ProductController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: function(req,file,cb)
    {
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString() + file.originalname)
    }
})
const fileFilter = (req,file,cb) =>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/png')
    {
        cb(null,true)
    }else{
        cb(new Error("format not allowed"),false)
    }
}
//const upload = multer({dest:'uploads/'})
const upload = multer({storage:storage,
    limits:{
    fileSize:1024 * 1024 * 5, //5 megas
    },
    fileFilter:fileFilter
})

router.get('/',ProductController.get_all_products)
router.post('/',checkAuth,upload.single('productImage'),ProductController.upload_image)
router.get('/:productsId',ProductController.get_product)
router.patch('/:productId',checkAuth,ProductController.update_product)
router.delete('/:productId',checkAuth,ProductController.delete_product)

 module.exports = router