//jshint esversion:6
require('dotenv').config();
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const encrypt = require('mongoose-encryption')

const app=express();

console.log(process.env.API_KEY);
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");
let userSchema=new mongoose.Schema({
  email:String,
  password:String
});
const secret=process.env.OUR_SECRET;
userSchema.plugin(encrypt, {secret:secret, encryptedFields: ["password"]});
let User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
  const userName=req.body.username;
  const pass=req.body.password;
  const newUser=new User({
    email:userName,
    password:pass
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render('secrets');
    }
  });
});

app.post("/login",function(req,res){
  const userName=req.body.username;
  const pass=req.body.password;
  User.findOne({email:userName},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password===pass){
          res.render("secrets");
        }
        else{
          res.send("password doesn't match");
        }
      }
      else{
        res.send("NO user found on this email");
      }
    }
  });
});


app.listen(3000,function(){
  console.log('server started on port 3000');
});
