let express=require("express");
let app=express();
let Sequelize=require('sequelize');
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
})

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
// routes for book and book category
app.post("/books",function(req,res){
    const data1={
        bookId:req.body.bookId,
        bookTitle:req.body.title,
        publishingHouse:req.body.publishingHouse,
        dateOfPublication:req.body.dateOfPublication,
        author:req.body.author,
        pages:req.body.pages
    }

    connection.query("insert into book SET ? ",data1,function(error){
        if(error)
        res.send(error);
        else
        res.send("Done connection");
    })
});

app.get("/Book",function(req,res){
    res.render("Book");
});

//routes for bookCategory
app.post("/BookCategories",function(req,res){
    const data={
        category_Id:req.body.categoryId,
        category_Name:req.body.categoryName
    }
    connection.query("insert into book_category SET ?",data,function(error){
        if(error)
        res.send(error);
        else
        res.redirect("BookCategory")
    })
})

app.get("/BookCategory",function(req,res){
    connection.query("select * from book_category",(error,results)=>{
        if(error)
        res.send(error)
        else
        res.render("BookCategory",{items:results});
    })
    
})
// routes for checkin book

app.get("/CheckIn",function(req,res){
    connection.query("select firstName,lastName,bookTitle from Client,book",(error,results)=>{
        if(error)
        res.send(error)
        else
        res.render("CheckIn",{dropdowns:results})
    })
})

app.post("/CheckIn",function(req,res){
    const data={
        firstName:req.body.names,
        bookName:req.body.bookTitle

    }
    connection.query("insert into operations SET ?",data,(error)=>{
if(error)
res.send(error)
else
res.redirect("CheckIn")
    })
})

//routes for Checkout 
app.get("/CheckOut",function(req,res){
    connection.query("select firstName,lastName,bookTitle from Client,book",(error,results)=>{
        if(error)
        res.send(error)
        else
        res.render("CheckOut",{dropdowns:results})
    });

})

app.post("/CheckOut",function(req,res){
    const data={
        firstName:req.body.names,
        bookName:req.body.bookTitle

    }
    connection.query("insert into operations SET ?",data,(error)=>{
if(error)
res.send(error)
else
res.redirect("CheckOut")
    })
})
//Listening port

app.listen(3000,function(){
    console.log("server up");
});