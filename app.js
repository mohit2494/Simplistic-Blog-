/* app.js - controller file for routing */

// initialising variables
var methodOverride = require('method-override'),
     bodyParser = require('body-parser'),
     mongoose = require('mongoose'),
     express = require('express'),
     expressSanitizer = require("express-sanitizer"),
     app = express();

// configure mongoose
mongoose.connect("mongodb://localhost/restful_blog_app");

// change viewing engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
/* express sanitizer helps sanitize the form inputs by removing 
the unnecessary script tags or any other tags from the body */

// create mongoose schema
var blogSchema = new mongoose.Schema({
     title: String,
     image: String,
     body: String,
     created: { type: Date, default: Date.now }
});

// creating blog model
var Blog = mongoose.model("Blog", blogSchema);

// creating a route to redirect to index on launch
app.get("/", function(req, res) {
     res.redirect("/blogs");
});

// index restful route
app.get("/blogs", function(req, res) {

     // retrieve all blogs from the database
     Blog.find({}, function(err, blogs) {
          if (err) {
               console.log("error encountered : ");
               console.log(err);
          }
          else {
               res.render("index", { blogs: blogs });
          }
     });
});

// new restful route
app.get("/blogs/new", function(req, res) {
     // render the new blog form
     res.render("new");
});

// create restful route
app.post("/blogs", function(req, res) {
     // Sanitizing the form body to check 
     req.body.blog.body = req.sanitize(req.body.blog.body);
     //create blog
     Blog.create(req.body.blog, function(err, newBlog) {
          if (err) {
               res.render("new");
          }
          else {
               res.redirect("/blogs");
          }
     });
});

// show route
app.get("/blogs/:id", function(req, res) {
     Blog.findById(req.params.id, function(err, foundBlog) {
          if (err)
               console.log(err);
          else
               res.render("show", { blog: foundBlog });
     });
});

// edit route
app.get("/blogs/:id/edit", function(req, res) {
     Blog.findById(req.params.id, function(err, foundBlog) {
          if (err)
               res.redirect("/blogs");
          else
               res.render("edit", { blog: foundBlog });
     });
});

// update route
app.put("/blogs/:id", function(req, res) {
     // Sanitizing the form body to check 
     req.body.blog.body = req.sanitize(req.body.blog.body);
     // Updating blog with given ID
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
          if (err)
               res.redirect('/blogs');
          else
               res.redirect('/blogs/' + req.params.id);
     });
});

// delete route
app.delete("/blogs/:id", function(req, res) {
     // remove blog
     Blog.findByIdAndRemove(req.params.id, function(err) {
          if (err)
               res.redirect("/blogs");
          else
               res.redirect("/blogs");

     });
});


// adding server listener
app.listen(process.env.PORT, process.env.IP, function() {
     console.log("server is running");
});
