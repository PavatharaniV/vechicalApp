const User = require('../models/user')
const ResetToken = require('../models/resetToken')
const { isValidObjectId } = require("mongoose");

exports.isResetTokenValid = async(req,res,next) =>{
    const { token,id} = req.query;

    if(!token || !id) {
        res.json({success:false,message:'Invalid request!'})
    }

    if(!isValidObjectId(id)){
        res.json({success:false,message:'Invalid user'})
    }

    const user = await User.findById(id)
    if(!user){
        res.json({success:false,message:'user not found!'})
    }

    const resetToken = await ResetToken.findOne({owner:user._id})
    if(!resetToken){
        res.json({success:false,message:'Reset token not found!'})
    }
    
    const isValid = await resetToken.compareToken(token)
    if(!isValid){
        res.json({success:false,message:'Reset token not invalid!'})
    }

    req.user = user;
    next()
}