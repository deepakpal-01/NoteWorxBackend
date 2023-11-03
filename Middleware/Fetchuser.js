const jwt=require( 'jsonwebtoken')
const JWT_SECRET="Deepakpalfirstjwtsecret"

const fetchuser=(req,res,next)=>{
    const token= req.header('auth-token')
    if(!token){
        res.status(401).send({success:false,message:"Authenticate with a valid token"})
    }
    try {
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).json({success:false,message:"Error in fetchuser"})
    }
}


module.exports=fetchuser;