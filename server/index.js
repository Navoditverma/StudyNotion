const express=require("express");
const app=express();

const userRoutes=require("./routes/User")
const profileRoutes=require("./routes/Profile")
const courseRoutes=require("./routes/Course")
const paymentRoutes=require("./routes/Payments")

const database=require("./config/database")
const cookieParser=require("cookie-parser");
const cors=require('cors')
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload")
const dotenv=require("dotenv");


dotenv.config();

const PORT=process.env.PORT || 4000;
//db connect
database.connect();
//middelware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000", 
        methods: ['GET', 'POST', 'PUT', 'DELETE'],    //entertains frontend request
        credentials:true,
    })
)
// app.use(cors());

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}))

//cloiudinary connect
cloudinaryConnect();

//routes

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);

app.get("/", (res,req)=>{
    return res.status(200).json({
        success:true,
        message:"Your Server is Up and Running"
    })

}
)

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
})


