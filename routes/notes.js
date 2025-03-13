const express=require("express");
const router=express.Router();
const Notes=require("../models/Notes");

router.get("/",async(req,res)=>{
    try{
        const notes=await Notes.find().sort({timestamp:1})
        re.json(notes);
    }catch(error){
        res.status(500).json({error:"Server error"});
    }
});
router.post("/",async(req,res)=>{
    try{
        const{content,room}=req.body;
        const newNotes=new Notes({content,room});
        await newNotes.save();
        res.status(201).json(newNotes)
    }catch(error){
        res.status(500).json({error:"Could not save the notes"});

    }
});
module.exports=router