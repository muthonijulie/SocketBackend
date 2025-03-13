const express=require("express");
require("dotenv").config();
const http=require("http");
const {Server}=require("socket.io");
const cors=require("cors");
const mongoose=require("mongoose");

const Notes=require("./models/Notes")
const NotesRoute=require("./routes/notes");

let users=[]
const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*"
    }
});

app.use(cors());
app.use(express.json());
app.use("/api/notes",NotesRoute);

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>console.log("MongoDB database connected"))
.catch(err=>console.error("MongoDB error",err));

io.on("connection",(socket)=>{
    console.log(`User connected:${socket.id}`);

    socket.on("joinRoom",async(room)=>{
        socket.join(room);
        const note=await Notes.findOne({room});


        if (!note){
            await Notes.create({room,content:""});
        }
        socket.emit("load-note", note ? note.content : "");
        io.to(room).emit("userJoined", `A user joined room ${room}`);
    });
    //allows user to edit
    socket.on("editNotes",async({room,content})=>{
        await Notes.findOneAndUpdate({room},{content,updatedAt:Date.now()});
        socket.to(room).emit("updateNotes",content);
        });

socket.on("disconnect",()=>{
    io.emit("userLeft","Auser left");
    console.log(`Sockets disconnected:${socket.id}`);

    });
});
const PORT=process.env.PORT || 4000;
server.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`));