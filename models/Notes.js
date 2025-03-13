const mongoose=require("mongoose");

const NotesSchema=new mongoose.Schema({
    content:{type:String,required:true},
    room:{type:String,required:true},
    updatedAt:{type:Date,default:Date.now},
});

module.exports=mongoose.model("Notes",NotesSchema);