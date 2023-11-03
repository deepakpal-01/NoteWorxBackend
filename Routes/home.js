const express=require('express')
const router=express.Router()


router.get('/',(req,res)=>{
    res.send("Welcome to our first full stack app!!!!!!")
})

module.exports=router