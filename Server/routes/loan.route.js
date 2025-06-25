const express =require('express');

const loanRouter=express.Router();

const IBSloaner = require('../models/Loan.model');
const IBSuser = require('../models/user.model');
const {auth} = require('../auth/auth.middleware');

loanRouter.get("/getLoaners" , async(req, res)=>{
    try{
        let loaners=await IBSloaner.find();
        if(!loaners){
            res.status(404).json({message:"No Loaner Availble"});
        }
        return res.status(200).json({message:"Loaners successful" ,users:loaners , success : true})
    }
    catch(err){
        return res.status(500).json({message:`${err}`})
    }
})

loanRouter.post("/addLoaner",async(req,res)=>{
    try{
        const { userID,name,amount,...rest } = req.body;
        console.log("Incoming userID:", req.body.userID);
       let existingUser = await IBSuser.findOne({_id:userID});
       console.log(existingUser.activeLoanId);
       
        if(existingUser.activeLoanId){
            return res.status(400).json({message:"User already have loan", success:false})
        }
        else{
            const newLoaner= new IBSloaner({userId:userID,name ,amount,...res});
             await newLoaner.save();
             // Here i need to call user and make 
            existingUser.hasLoan =true;
            existingUser.activeLoanId =newLoaner._id;
            await existingUser.save();
            console.log("Successfully done");

         return res.status(201).json({
             message: "Loaner registration successful",
           user: newLoaner,
            success: true
        })
        }
       
    }
    catch(err){
         return res.status(500).json({message:`${err}`})
    }
})
module.exports=loanRouter;