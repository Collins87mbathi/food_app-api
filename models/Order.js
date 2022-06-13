const mongoose  = require('mongoose');

const orderSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
          type:String,
          required:true 
    },
    userid : {
        type:String,
    },
    orderItems: [],
    shippingAddress: {
      type: Object,
    },
    orderAmount : {
        type:String,
    },
    isDelivered : {
        type:Boolean,
        default:false
    },
    transactionId : {
        type:String,
    }

},
{timestamps:true}
)

module.exports = mongoose.model('Order',orderSchema);
