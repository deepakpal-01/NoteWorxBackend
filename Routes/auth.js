const express=require('express')
const router=express.Router()

const User=require('../Models/UserModel')
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs')
const jwt=require( 'jsonwebtoken')
const fetchuser=require('../Middleware/Fetchuser')


let success=true


const JWT_SECRET="Deepakpalfirstjwtsecret"

//Router 1:  Creating user profile
router.post('/createuser',[           //setting validations
    body('name',"Enter full name").isLength({min:3}),
    body('email',"Enter valid Email").isEmail(),
    body('password',"Password is too short").isLength({min:5})
]
,async(req,res)=>{ 
    //checking validations for fields and returns bad request
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,errors: errors.array()});
    }
    try{        
        let userExists=await User.findOne({email : req.body.email})
        if(userExists){        
            return res.status(400).json({success:false,error:"Sorry! User already Exists."})
        }

        const salt= await bcrypt.genSalt(10);
        const securedPassword= await bcrypt.hash(req.body.password,salt);

        //creating a user in database
        let user=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:securedPassword
        })    

        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET)
        res.json({success,authtoken})
    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }

})

//Route 2: Login existing user
router.post('/login',[
    body('email',"Invalid Email").isEmail(),
    body('password',"Invalid Password ").exists()
],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,errors: errors.array()});
    }
    const {email,password}=req.body
    try{
        let user=await User.findOne({email:`${email}`})
        if(!user){
            return res.status(400).json({succes:false,error:"User not Found"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            return res.status(400).json({success:false,error:"Invalid password"})
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET)
        res.json({success,authtoken})

    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false,message:"Internal server Error."})
    }  

})
 
//Route 3: Getting info of logged in User via authtoken
router.get('/getuser',fetchuser,async(req,res)=>{
    try {
        const userId=req.user.id
        const user=await User.findById(userId).select("-password")
        success=true
        res.json({success,user})
    } catch (error) {
        success=false
        res.status(401).json({success:false,message:"Can not get a user!!"})
    }
})




module.exports=router