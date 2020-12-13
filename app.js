const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express()
const port = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

// Request targetting all articles
app.route("/articles")

    .get(function(req, res){
        Article.find(function(err, result){
            if(!err){
                console.log(result);
                res.send(result)
            }else{
                console.log(err)
                res.send(err)
            }
        }); 
    })

    .post(function(req, res){
        const posts = new Article({
            title: req.body.title,
            content: req.body.content
        });

        posts.save(function(err){
            if(!err){
                res.send("Successfully added");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function(req, res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("successfully Deleted");
            }else{
                res.send(err);
            }
        });
    })

    // Request targetting a specific article
app.route("/articles/:artcleTitle")

    .get(function(req, res){
        
        Article.findOne({title: req.params.artcleTitle}, function(err, foundArticle){
            if (foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No match found!")
            }
        });
    })

    .put(function(req, res){
        Article.updateOne(
            {title: req.params.artcleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                if(!err){
                    res.send("Succesfully updated article");
                } else {
                    res.send(err);
                }
            }
        );

    })

    .patch(function(req, res){
        Article.updateOne(
            {title: req.params.artcleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("update successful")
                } else {
                    res.send(err)
                }
            }
        );
    })

    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.artcleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted the corresponding article");
                } else {
                    res.send(err);
                }
            }
        )
    });



app.listen(port, function(){
    console.log("Voom! it's working");
}); 

