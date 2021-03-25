const Product = require('../models/product')
const mongoose = require('mongoose')

exports.get_all_products = (req,res,next)=>{

    Product.find()
    .select("name price productImage _id")
    .exec()
    .then(docs =>{
        const response ={
            count:docs.length,
            products:docs.map(doc =>{
                return{
                    name:doc.name,
                    price:doc.price,
                    productImage:doc.productImage,
                    _id:doc._id,
                    request:{
                        type:"GET",
                        url:"http://localhost:3002/products/"+doc._id
                    }
                }
            })
        }
        console.log(docs)
        res.status(200).json(response)
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
}
exports.upload_image = (req,res,next)=>{
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    })
    product.save()
    .then(result =>{
        console.log(result)
        res.status(201).json({
            message:'Created product successfully',
            createProduct:{
                name:result.name,
                price:result.price,
                productImage:result.productImage,
                _id:result._id,
                request:{
                    type:"GET",
                    url:"http://localhost:3001/products/"+result._id
                }
            }
        })
    }).catch(err =>{
        console.log("Mensaje ! ",err)
        res.status(500).json({
            error:err
        })

    })
 }
 exports.get_product =(req,res,next)=>{
    const id = req.params.productsId 
    Product.findById(id)
    .select("name price productImage _id")
    .exec()
    .then(doc =>{
        console.log("fron database ",doc)
        if(doc)
        {
            res.status(200).json(doc)
        }else{
            res.status(404).json({
                message:"No valid entry found for provider ID"
            })
        }
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({error:err})
    })
 }
 exports.update_product = (req,res,next)=>{
    const id = req.params.productId
    const updateOps = {}
    for(const ops of req.body)
    {
        updateOps[ops.propName] = ops.value
    }
    Product.updateMany({_id:id},{$set:updateOps})
    .exec()
    .then(result =>{
        console.log(result)
        res.status(200).json(result)
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({
            message:err
        })
    })
 }
 exports.delete_product = (req,res,next)=>{
    const id = req.params.productId
  Product.remove({_id:id})
  .exec()
  .then(result =>{
      console.log(result)
      res.status(200).json(result)
  })
  .catch(err =>{
   res.status(500).json({
       error:err
   })
  })
}