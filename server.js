const express = require("express");
const generateUniqueId = require('generate-unique-id');
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/notes.html"))
})

app.get('/api/notes',(req,res)=>{
    console.log("hoho");
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"oh no!",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            res.json(dataArr)
        }
    })
})

app.post('/api/notes/',(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"oh no!",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            let userNote = {
                title: req.body.title,
                text: req.body.text,
                // creating unique id for each note
                id: getNewUniqueId(),
              };
            dataArr.push(userNote);
            fs.writeFile("./db/db.json",JSON.stringify(dataArr,null,4),(err,data)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        msg:"oh no!",
                        err:err
                    })
                }
                else {
                    res.json({
                        msg:"successfully added!"
                    })
                }
            })
        }
    })
})
app.get('*',(req,res)=>{
    console.log("c.html");
    res.sendFile(path.join(__dirname,"./public/index.html"))
})
app.listen(PORT,()=>{
    console.log(`listenin on port ${PORT}`)
})

function getNewUniqueId() {
    return generateUniqueId({
      length: 5,
      useLetters: true,
      useNumbers: true
    });
  }