//jshint esversion:6
require('dotenv').config()
const   express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
var md5 = require('md5');


const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({email:String, password: String});

const User = mongoose.model('User', userSchema);


app.get("/", (req, res)=>{
  res.render('home')
})

app.get("/login", (req, res)=>{
  res.render('login')
})

app.get("/register", (req,res)=>{
  res.render('register')
})

app.post("/register", (req, res)=>{
const email = req.body.username;
const password = md5(req.body.password);
console.log(password);

const newUser = new User({
  email : email,
  password : password
})

User.findOne({email : req.body.username}, (err, foundUser)=>{
  if(!err){
    if(foundUser){
      res.redirect("/login")
    }else{
      newUser.save((err)=>{
        if(!err){
          res.render("secrets")
          console.log("New user registered succesfully");
        }else{
          console.log(err);
        };
      });
    };
  }else{
    console.log(err);
  };
});

});

app.post("/login", (req, res)=>{
  const email = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email : req.body.username},(err, foundUser)=>{
    if(!err){
      if(foundUser){
        if(password === foundUser.password){
          res.render("secrets")
        }else{
          res.redirect("/login")
        }
      }else{
        res.redirect("/register")
      }
    }else{
      console.log(err);
    }
  } )
})

app.listen(3000, ()=>{
  console.log("app running on port 3000");
})
