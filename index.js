const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
dotenv.config();
const PORT = process.env.PORT;
const CONNECTDB = require('./Database/Connect');
const userRouter = require('./routers/User');
const uploadRouter = require('./routers/upload');
const productRouter = require('./routers/Product');
const categoryRouter = require('./routers/Category');


//database connection 
CONNECTDB(process.env.MONGO_DB);

//middlewares
app.use(express.json());
app.use(cors({origin:'*'}))
app.use(cookieParser())
app.use(fileUpload({    
    useTempFiles: true
}))


//endpoints 
app.use('/api/v1/user',userRouter);
app.use('/api/v1/image',uploadRouter);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/category',categoryRouter);

app.get('/', (req,res)=>{
 res.send('this is food delivery backend');
})

//listening 
app.listen( PORT, () => {

console.log("server is listening");

});

