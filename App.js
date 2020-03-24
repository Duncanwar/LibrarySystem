let express=require("express");
let app=express();
let bodyParser=require('body-parser');
let msyql=require("mysql");
let multer=require('multer');
let upload=multer({dest:'public/uploads/'});



let connection=msyql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:"Library"

});


connection.connect(function(error){
    if (error) {
        console.log(error);
    }
    else{
        console.log("connected");
    }
}
);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");

app.get("/",function(req,res){
res.render("Home");
});


app.get("/SignUp",function(req,res){
    res.render("SignUP");
})


app.post("/home",function(req,res){
   
     const data={
       regNo:req.body.regNo,
       firstName:req.body.firstName,
       lastName:req.body.lastName,
       phoneNumber:req.body.phoneNumber,
       emailAddress:req.body.emailAddress,
       clientCategory:req.body.client,
       photo:req.body.photo
     }
 
   
    connection.query('insert into Client SET ?',data,function(error){
        if(error)
    res.send(error);
        else
        res.redirect("index");
    });



});

app.post("/delete/:regNo",function(req,res){
    connection.query('delete from Client where regNo =?',[req.params.regNo],(error,results)=>{
res.redirect("/index");
    })
})

app.get("/edit/:id",function(req,res){
    connection.query('select *  from Client where regNo=?',[req.params.id],(error,results)=>{
        res.render('new');
    });
});

app.post("/update/:id",function(req,res){
    connection.query('update Client set firstName = ? where regNo= ?',[req.body.firstName,req.params.id],(error,results)=>{
        res.redirect("/index");
    })
})

//get the data in database
app.get("/index",function(req,res){
    connection.query('select * from Client',(error,rows)=>{
        if(!error)
        res.render("index",{items:rows});
        else
        console.log(error);

    })
});
// dealing with the Library

app.get("/Client",function(req,res){
    res.render("Client");
   
})




app.listen(3000,function(){
    console.log("server up");
});