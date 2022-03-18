// Require relevant NPM modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// Set up the express middleware
const app = express();
// Set EJS as the view engine for the project
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// Set the 'public' folder as the location for static files
app.use(express.static("public"));

// Connect Node server to local MongoDB database
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// Create a schema for new articles
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
    if (!err) {
      // Send the found items back if there are no errors
      res.send(results);
    } else {
      // Send back the error(s) if there's any
      res.send(err);
    }
  });
});

// Handle 'post' requests on the /articles route
app.post("/articles", (req, res) => {
  // Create a new article based on the 'Article' model
  const newArticle = new Article({
    // Use the sent data as the values for the new article
    title: req.body.title,
    content: req.body.content
  });
  // Attempt to save the new article and run the if condition
  newArticle.save((err) => {
    // Save the new article if there are no errors
    if (!err) {
      // Send back a success message in case all goes well
      res.send("Successfully added a new article.");
    } else {
      // Send back the error(s) if there's any
      res.send(err);
    }
  });
});

// Handle 'delete' requests on the /articles route
app.delete("/articles", (req, res) => {
  // Attempt to delete all articles and run the if condition
  Article.deleteMany((err) => {
    // Delete all articles if there are no errors
    if (!err) {
      // Send back a success message in case all goes well
      res.send("Successfully deleted all articles.");
    } else {
      // Send back the error(s) if there's any
      res.send(err);
    }
  });
});

// Listen on specified port and logs on success
app.listen(process.env.PORT || 3000, () => {console.log("Server running on port 3000")});
