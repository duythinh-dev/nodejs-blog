const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Routers

/**
 * GET
 * Home page
 */
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "Nodejs Blog",
      description: "NodeJS Blog description",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.co;
    const nextPage = parseInt(count, 10) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

// function inseartPostData() {
//   Post.insertMany([
//     {
//       title: "Building a blog",
//       body: "This is body of the post",
//     },
//     {
//       title: "Building a blog",
//       body: "This is body of the post",
//     },
//     {
//       title: "Building a blog",
//       body: "This is body of the post",
//     },
//     {
//       title: "Building a blog",
//       body: "This is body of the post",
//     },
//     {
//       title: "Building a blog",
//       body: "This is body of the post",
//     },
//     {
//       title: "Building a blog",
//       body: "This is body of the post",
//     },
//     {
//       title: "Building a blog",
//       body: "This is body of the post",
//     },
//   ]);
// }
// inseartPostData();

/**
 * GET
 * Post
 */
router.get("/post/:id", async (req, res) => {
  try {
    const locals = {
      title: "Nodejs Blog",
      description: "NodeJS Blog description",
    };

    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST
 * Post
 */
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "NodeJS Blog description",
    };

    let searchTerm = req.body.searchTerm;

    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g);
    console.log(searchTerm);

    const data = await Post.find({
      $or: [
        {
          title: {
            $regex: new RegExp(searchNoSpecialChar, "i"),
          },
        },
        {
          body: {
            $regex: new RegExp(searchNoSpecialChar, "i"),
          },
        },
      ],
    });

    res.render("search", {
      locals,
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: `/about`,
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    currentRoute: `/contact`,
  });
});

module.exports = router;
