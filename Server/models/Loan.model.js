const mongoose=require('mongoose');
const IBSuser =require('./user.model');


const LoanSchema= new mongoose.Schema({
    userId: 
    { type: mongoose.Schema.Types.ObjectId,
         ref: 'IBSuser' ,
         required :[true,'Only IBS user can take loan'] },
  amount: {
    type:Number,
    required:[true,'Please add the amount']
  }, // total amount given as loan
  name:{
    type:String,
    required:[true, 'Please Enter the name of the user'],
  },
  startMonth: String,
  startYear: Number,
  installmentAmount: Number,
  totalInstallments: Number,
  installmentsPaid: [
    {
      month: String,
      year: Number,
      paid: Boolean,
    }
  ],
  isCompleted: Boolean,
   witness1:{
    type:String,
    default:null
  },
  witness2:{
    type:String,
    default:null
  },
},{
    timestamps:true
});

module.exports= mongoose.model('IBSloaner',LoanSchema);