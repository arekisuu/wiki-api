const express=require("express"),bodyParser=require("body-parser"),ejs=require("ejs"),mongoose=require("mongoose"),app=express();app.set("view engine","ejs"),app.use(bodyParser.urlencoded({extended:!0})),mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:!0});const articleSchema={title:String,content:String},Article=mongoose.model("Article",articleSchema);app.route("/articles").get((e,t)=>{Article.find((e,s)=>{e?t.send(e):t.send(s)})}).post((e,t)=>{new Article({title:e.body.title,content:e.body.content}).save(e=>{e?t.send(e):t.send("Successfully added a new article.")})}).delete((e,t)=>{Article.deleteMany(e=>{e?t.send(e):t.send("Successfully deleted all articles.")})}),app.route("/articles/:article").get((e,t)=>{Article.findOne({title:e.params.article},(e,s)=>{s?t.send(s):t.send("No articles match specified title.")})}).put((e,t)=>{Article.replaceOne({title:e.params.article},{title:e.body.title,content:e.body.content},e=>{e?t.send(e):t.send("Successfully overwritten article.")})}).patch((e,t)=>{Article.updateOne({title:e.params.article},{$set:e.body},e=>{e?t.send(e):t.send("Successfully updated article.")})}).delete((e,t)=>{Article.deleteOne({title:e.params.article},e=>{e?t.send(e):t.send("Successfully deleted article.")})}),app.listen(process.env.PORT||3e3,()=>{console.log("Server running on port 3000")});