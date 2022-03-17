// Require relevant NPM modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// Set up the modules
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect Node server to local MongoDB database
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// Create schema for the articles
const articleSchema = {
    title: String,
    content: String
};

// Create a model based on the appropriate schema
const Article = mongoose.model("Article", articleSchema);

// Handle 'get' requests on the /articles route
app.get("/articles", (req, res) => {
  // Find every item in the collection
  Article.find((err, results) => {
    // Send the found items back if there are no errors
    if(!err) {
      res.send(results);
      // Send the error(s) back if there's any
    } else {
      res.send(err);
    }
  });
});

// Listen on specified port and logs on success
app.listen(process.env.PORT || 3000, () => {console.log("Server running on port 3000")})
