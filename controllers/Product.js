const Product = require('../models/Products');


class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
       const queryObj = {...this.queryString} //queryString = req.query

       const excludedFields = ['page', 'sort', 'limit']
       excludedFields.forEach(el => delete(queryObj[el]))
       
       let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
       this.query.find(JSON.parse(queryStr))
         
       return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating(){
        const page = this.queryString.page * 1 || 3
        const limit = this.queryString.limit * 1 || 20
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}



const createProducts = async (req,res) => {

try {
   const {title,price,description,category,image} = req.body ;

   if(!image) return res.status(400).json({msg: "no image uploaded"});

   const newProducts = new Product({
       title: title.toLowerCase(),price,description,category,image
   });
 await newProducts.save();
 res.status(200).json({msg:"product created"});

} catch (error) {
    res.status(500).json({msg:error.message});
}

}

const getProduct = async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({error});
    }
}

const getProducts = async (req,res) => {
    try {
      const features = new APIfeatures(Product.find(),req.query).filtering().sorting().paginating();
      
      const products = await features.query;

      res.status(200).json({items:products})

    } catch (error) {
        res.status(500).json({msg:error.message});
    }

}

const updateProducts = async (req,res) => {
    try {
        const {title, price, description, image, category} = req.body;
        if(!image) return res.status(400).json({msg: "No image upload"})

      await Product.findOneAndUpdate({_id:req.params.id},{
       title:title.toLowerCase(),price,description,category
      });

    res.status(200).json({msg:"product updated"});

    } catch (error) {
        res.status(500).json({msg:error.message});
    }
}

const deleteProducts = async (req,res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        
        res.status(200).json({msg:"product deleted successfully"});

    } catch (error) {
        res.status(500).json({msg:error.message});
    }
}

module.exports = {createProducts,getProducts,deleteProducts,updateProducts,getProduct};