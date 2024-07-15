//jshint esversion:6
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Welcome to our blog platform, a dynamic space for readers and writers alike. Here, you'll find a diverse range of blog posts on topics like technology, lifestyle, travel, health, and personal development. Our community is built on creativity and inclusivity, offering a supportive environment for both seasoned writers and beginners to share their stories and insights. With an easy-to-use interface, you can effortlessly explore categories, engage with authors, and stay updated with our latest content. Join us today to read, write, and connect with a global community that values every voice.";
const aboutContent = "I'm Arjun Patel, an engineer passionate about contributing to organizational success and achieving personal growth. With expertise in HTML, CSS, React Js, JavaScript, Node, Express, MongoDB, SQL, GIT, API, EJS, C++, and Python, I bring strong communication, problem-solving, and quick-learning skills. As an Assistant System Engineer Trainee at Tata Consultancy Services, I mastered web technologies and developed interfaces using modern frameworks. I hold a Bachelor's in Mechanical Engineering with a 8.23 CGPA and have excelled in various educational and project endeavors, including web apps like Keeper and TinDog.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://hackmech007:${process.env.MONGO_PASS}@cluster0.i8yam1q.mongodb.net/blogDB`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mongoose.connect(uri)
.then(() => {
  console.log("Connected Successfully...!");
})
.catch((error) => {
  console.log(error);
})

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);


app.get("/", async function (req, res) {
  try {
    const posts = await Post.find();

    if (!posts) {
      res.render("home", {
        startingContent: homeStartingContent,
      });
    }
    // console.log(posts);
    res.render("home", {
      startingContent: homeStartingContent,
      postsArray: posts,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/test", function (req, res) {
  res.render("test", {
    startingContent: homeStartingContent
  });
});


app.post("/compose", async function (req, res) {
  try {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });
    await post.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }


  res.redirect("/");
});

app.get("/posts/:postId", async function (req, res) {
  try {
    const requestedPostId = req.params.postId;

    const posts = await Post.findOne({_id: requestedPostId});

    if (!posts) {
      return res.status(404).send("Post not found");
    }
    // console.log(posts);
    // console.log(posts.title);
    res.render("post", {
      title: posts.title,
      content: posts.content,
      posts: posts
    });
    
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async function (req, res) {
  try {
    const blogId = req.body.blogId;
    await Post.findByIdAndDelete(blogId);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

module.exports = app;