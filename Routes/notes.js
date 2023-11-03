const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const fetchuser = require("../Middleware/Fetchuser");
const Notes = require("../Models/NotesModel");


//Route :1 Adding a note of a logged in user   :login required   --use fetchuser middleware
router.post("/addnote",fetchuser,[
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "Enter valid description").isLength({ min: 3 }),
  ],
  async (req, res) => {
    //checking validations for fields and returns bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const notes = await Notes.create({
        title: title,
        description: description,
        tag: tag,
        user: req.user.id,
      });
      res.json(notes);
    } catch (error) {
      res.status(500).send("Internal Server Error!.");
    }
  }
);


//Route : 2 Fetching all the notes of a logged in user   :login required --use fetchuser middleware 
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const userid = req.user.id;
    const usernotes = await Notes.find({ user: userid });
    res.send(usernotes);
  } catch (error) {
    res.status(500).send("Internal Server Error!.");
  }
});

//Route: 3 Updating existing note of a logged in user  :login required --use fetchuser middleware
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    try {   
           
    const {title,description,tag}=req.body
    const newNote={}
    if(title) {newNote.title=title}
    if(description) {newNote.description=description}
    if(tag) {newNote.tag=tag}

    let note=await Notes.findById(req.params.id)
    if(!note) return res.status(404).send("Note not found!!")

    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Access Denied!!")
    }
    note=await Notes.findOneAndUpdate({_id:req.params.id},{$set :newNote},{new:true})
    res.json({note})
    } catch (error) {
        res.status(500).send("Internal Server Error!.");
    }
})

//Route:4  Delete existing note of logged in user :login required  --use fetchuser middleware  
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try {
        let note=await Notes.findById(req.params.id)
        if(!note) return res.status(404).send("Note not found!!")

        if(note.user.toString()!==req.user.id){
        return res.status(401).send("Access Denied!!!")
        }

        note=await Notes.findByIdAndDelete(req.params.id)
        res.json({success:"Note deleted successfully",Note:note});
    } catch (error) {
        res.status(500).send("Internal Server Error!.");
    }
})

module.exports = router;
