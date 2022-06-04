//jshint esversion:6

const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const _ = require("lodash")
const mongoose = require("mongoose")

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set("view engine", "ejs")

// mongoose.connect("mongodb+srv://chef0206:Atlasadmin@cluster0.xso8g.mongodb.net/mylogsDB")
mongoose.connect("mongodb://localhost:27017/mylogsDB")

const home = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit neque veniam est recusandae sequi possimus cupiditate consequatur, quos provident laudantium quasi sapiente temporibus quo corporis ipsa magnam omnis sed voluptate dolore ab voluptates amet facere dolorem! Repellendus mollitia nemo ipsam corporis aliquid numquam explicabo animi, consequatur recusandae suscipit consequuntur eos illum aperiam quasi. Maiores deserunt esse perspiciatis sint! Culpa earum explicabo sunt, cum, ullam reiciendis vitae est veritatis cumque eveniet facere quasi pariatur, esse quas. Explicabo esse, commodi temporibus tempora, officia obcaecati quas voluptates dolore velit molestiae libero adipisci nisi iusto similique, ipsam corporis! Dolorem quia fuga natus necessitatibus iste!"
const about = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit neque veniam est recusandae sequi possimus cupiditate consequatur, quos provident laudantium quasi sapiente temporibus quo corporis ipsa magnam omnis sed voluptate dolore ab voluptates amet facere dolorem! Repellendus mollitia nemo ipsam corporis aliquid numquam explicabo animi, consequatur recusandae suscipit consequuntur eos illum aperiam quasi. Maiores deserunt esse perspiciatis sint! Culpa earum explicabo sunt, cum, ullam reiciendis vitae est veritatis cumque eveniet facere quasi pariatur, esse quas. Explicabo esse, commodi temporibus tempora, officia obcaecati quas voluptates dolore velit molestiae libero adipisci nisi iusto similique, ipsam corporis! Dolorem quia fuga natus necessitatibus iste!"
const contact = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit neque veniam est recusandae sequi possimus cupiditate consequatur, quos provident laudantium quasi sapiente temporibus quo corporis ipsa magnam omnis sed voluptate dolore ab voluptates amet facere dolorem! Repellendus mollitia nemo ipsam corporis aliquid numquam explicabo animi, consequatur recusandae suscipit consequuntur eos illum aperiam quasi. Maiores deserunt esse perspiciatis sint! Culpa earum explicabo sunt, cum, ullam reiciendis vitae est veritatis cumque eveniet facere quasi pariatur, esse quas. Explicabo esse, commodi temporibus tempora, officia obcaecati quas voluptates dolore velit molestiae libero adipisci nisi iusto similique, ipsam corporis! Dolorem quia fuga natus necessitatibus iste!"

let x = 0;
const logSchema = {
    id: Number,
    title: String,
    mylogs: String
}
const Logs = mongoose.model("log", logSchema)

app.get("/", function(req,res){

    res.render("home" , {content: home , Title: "Home"})
})

app.get("/blogs", function(req,res){

    Logs.find({}, function(err, foundLogs){

        if(err) console.log("Some error in adding logs to the database")
        else{
            res.render("blogs", {logs: foundLogs})
        }
    })

})

app.get("/blogs/:postname", function(req,res){
    let requestTitle = req.params.postname

    Logs.findOne({title: requestTitle}, function(err, foundLog){

        if(err) console.log("Some error in displaying the log independently")
        res.render("posts", {logs: foundLog})
    })
})

app.get("/about", function(req,res){
    res.render("home", {content: about, Title: "About Us"})
})

app.get("/contact", function(req,res){
    res.render("home", {content: contact, Title: "Contacts"})
})

app.get("/compose", function(req,res){
    res.render("compose")
})

/*app.get("/updatePost", function(req,res){

    let requestTitle = req.body.updatedLog
    console.log(requestTitle)
    Logs.findOne({title: requestTitle}, function(err, foundLog){

        if(err) console.log("Some error in displaying the log independently")
        res.render("update", {title: foundLog.title, content: foundLog.mylogs})
    })
})
app.post("/updatePost", function(req,res){


})*/
app.post("/blogs", function(req,res){

    const dailyLogs = new Logs({
        id: ++x,
        title: req.body.topic,
        mylogs: req.body.log
    })
    dailyLogs.save(function(err){
        if(!err)
        res.redirect("/blogs")
    })
    
})
app.post("/blogs/:postname", function(req,res){
    let requestname = req.params.postname
    res.redirect("/blogs/"+requestname)
})

app.post("/deletePost", function(req,res){
    
    let currentLog = req.body.currentLog
    Logs.findOneAndDelete({title: currentLog}, function(err, foundLog){
        if (err) console.log("Error in deleting log")
        else
        res.redirect("/blogs")
    })
})

app.get("/postUpdate/:postTitle", function(req,res){

    let currentTitle = req.params.postTitle
    Logs.findOne({title: currentTitle}, function(err, foundLog){
        console.log(foundLog)

        if(err) console.log("Some error in displaying the log independently")
        res.render("update", {logs: foundLog})
    })
})

app.post("/postUpdate", function(req,res){

    let currentLog = req.body.updateLog
    console.log(currentLog)
    res.redirect("/postUpdate/"+currentLog)

})

app.post("/updatedPost", function(req,res){

    let updatedTitle = req.body.topic
    let updatedLog = req.body.log
    let id = req.body.id
    console.log(id+ " " + updatedLog + " " + updatedTitle)
    update = {title: updatedTitle, mylogs: updatedLog}
    Logs.findOneAndUpdate({_id: id}, update, {new: true}, function(err, updatedLogs){

        if(err) console.log("Some Problem in updating the database.")
        res.redirect("/blogs/" + updatedLogs.title)
    })
})

app.listen(3000, function(){
    console.log("Server is running on port 3000")
})