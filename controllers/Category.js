
const Category = require("../models/Category");
const Product = require("../models/Products");





const getCategory = async (req,res) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

}

const createCategory = async (req,res)=> {

    try {
        const {name} = req.body
        const categories = await Category.findOne({name});
         if(categories) res.status(400).json({msg:"this category already exist"});
         const category = new Category({name})

        await category.save();
        res.status(200).json({msg:"category created"});
        
    } catch (error) {
       
        res.status(500).json({msg:error.message});
    }
 


}

const deleteCategory = async (req,res)=> {
   
    try {
        const products = await Product.findOne({category: req.params.id})
        if(products) return res.status(400).json({
            msg: "Please delete all products with a relationship."
        })

        await Category.findByIdAndDelete(req.params.id)
        res.json({msg: "Deleted a Category"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

const updateCategory =async (req,res) => {
    try {
        const {name} = req.body;
        await Category.findOneAndUpdate({_id: req.params.id}, {name})

        res.json({msg: "Updated a category"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


module.exports = {getCategory,createCategory,updateCategory,deleteCategory};
