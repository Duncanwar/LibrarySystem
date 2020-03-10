var express=require("express");
var app=express();
var bodyParser=require('body-parser');

let username=[];
let password=[];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");

app.get("/",function(req,res){
res.send("HomePage");
});

app.get("/Login",function(req,res){
   
res.render("Login");
});

app.get("/SignUp",function(req,res){
    res.render("SignUP");
})


app.post("/home",function(req,res){
     firstName=req.body.firstName;
    //let lastName=req.body.lastName;
     username.push(req.body.email);
     password=req.body.password;
    res.redirect("Login");
    console.log(firstName,email);

});

app.listen(3000,function(){
    console.log("server up");
});