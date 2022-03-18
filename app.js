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

// Connect Node server to local MongoDB database
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// Create a schema for new articles
const articleSchema = {
  title: String,
  content: String
};

// Create a model based on the above schema
const Article = mongoose.model("Article", articleSchema);

// Requests targetting all articles
app.route("/articles")
  .get((req, res) => {
    Article.find((err, results) => {
      if (!err) {
        // Send the found items back if there are no errors
        res.send(results);
      } else {
        // Send back the error(s) if there's any
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    // Create a new article based on the 'Article' model
    const newArticle = new Article({
      // Use data provided by the post request as the values for the new article
      title: req.body.title,
      content: req.body.content
    });
    // Attempt to save the new article and run the if condition
    newArticle.save((err) => {
      // Save the new article if there are no errors
      if (!err) {
        // Send back a success message if all goes well
        res.send("Successfully added a new article.");
      } else {
        // Send back the error(s) if there's any
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      // Delete all articles if there are no errors
      if (!err) {
        // Send back a success message if all goes well
        res.send("Successfully deleted all articles.");
      } else {
        // Send back the error(s) if there's any
        res.send(err);
      }
    });
  });

// Requests targetting a specific article
app.route("/articles/:article")
  .get((req, res) => {
    Article.findOne(
      // Query for the specified article
      {title: req.params.article},
      (err, result) => {
        if (result) {
          // Send back the article if it is found
          res.send(result);
        } else {
          // Send back an error message if none is found
          res.send("No articles match specified title.");
        }
      });
  })
  .put((req, res) => {
    Article.replaceOne(
      // Query for the specified article
      {title: req.params.article},
      // Overwrite ALL the article data using the values provided by the request (deletes fields if no new value is given)
      {title: req.body.title,content: req.body.content},
      (err) => {
        if (!err) {
          // Send back a success message if all goes well
          res.send("Successfully overwritten article.");
        } else {
          // Send back the error(s) if there's any
          res.send(err);
        }
      });
  })
  .patch((req, res) => {
    Article.updateOne(
      // Query for the specified article
      {title: req.params.article},
      // The $set operator keeps all non-specified fields unchanged and only updates what's provided by the request
      {$set: req.body},
      (err) => {
        if (!err) {
          // Send back a success message if all goes well
          res.send("Successfully updated article.");
        } else {
          // Send back the error(s) if there's any
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne(
      // Query for the specified article
      {title: req.params.article},
      (err) => {
        if (!err) {
          // Send back a success message if all goes well
          res.send("Successfully deleted article.");
        } else {
          // Send back the error(s) if there's any
          res.send(err);
        }
      }
    );
  });

// Listen on specified port and logs on success
app.listen(process.env.PORT || 3000, () => {console.log("Server running on port 3000")});
