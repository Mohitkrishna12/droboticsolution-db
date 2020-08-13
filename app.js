require('dotenv').config();
const express = require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");

const ejs=require("ejs");
const md5=require("md5");


mongoose.connect("mongodb+srv://admin-login:process.env.PASS@cluster0.fdebt.mongodb.net/formdb",{useNewUrlParser:true,useUnifiedTopology:true});


const app=express();


app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));


const contactSchema=new mongoose.Schema({
	fname:String,
	lname:String,
	email:String,
	subject:String,
	message:String,
	date:String

});

const userSchema=new mongoose.Schema({
	email:String,
	password:String
});

const User=mongoose.model("User",userSchema);


User.find({},function(err,foundusers){
		if(foundusers.length===0){
			const user1=new User({
				email:"info@droboticsolutions.com",
				password:md5(process.env.PASS)
			});
			
			user1.save();


		}

	});


const Client=mongoose.model("Client",contactSchema);

app.get("/", function(req,res){
	res.render("index");
});

app.get("/dnest", function(req,res){
	res.render("dnest");
});

app.get("/espion",function(req,res){
	res.render("espion");
});

app.get("/forms",function(req,res){
	res.render("admin-login");
	
	
});

app.get("/admin-login",function(req,res){
	res.render("admin-login");
});

app.get("/contact",function(req,res){
	res.render("contact");
});

app.post("/admin-login",function(req,res){
	
	
	

const username=req.body.email;
const passd=md5(req.body.password);


User.findOne({email:username},function(err,foundUser){
	if(!foundUser){
		res.render("admin-login");

	}
	else{
				
		if(foundUser.password===passd){
			
			Client.find({},function(err,founduser){
			console.log(founduser)

			res.render("forms",{formname:founduser});

	})
			}else{
				res.render("admin-login");

			}


		
		
	}
	
	
			

		
		});




});



app.post("/",function(req,res){
	const fname= req.body.fname;
	const lname=req.body.lname;
	const email=req.body.email;
	const subject=req.body.subject;
	const message=req.body.message;
	var options={year: 'numeric', month: 'numeric', day: 'numeric'};
			var today=new Date();
			var currDay=today.getDate();
			var day=today.toLocaleDateString("hi-IN",options);
	


	const clientx=new Client({
		fname:fname,
		lname:lname,
		email:email,
		subject:subject,
		message:message,
		date:day

	});

	clientx.save();
	console.log(clientx);
	res.redirect("/contact");
})















app.listen(process.env.PORT || 3000,function(){

	console.log("server runing");
})
