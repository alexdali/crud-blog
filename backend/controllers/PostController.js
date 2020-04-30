const User = require("../db/models").User;
const Post = require("../db/models").Post;
const status = require("../utils/status");

// the number of posts per page
const perPage = 5;

module.exports = {

  // function to request all posts of the user
  async getAllPostsOfUser(req, res) {
    try {
      // request for user record by id without "password" attribute"
      const user = await User.findByPk(
        req.params.userId, { attributes: { exclude: ['password'] } }
      );
      // if request was successful
      // get all posts of the user from the database
      if(user) {
        const postCollection = await Post.findAll({
          include: [{
              model: User, as: 'author',
              where: { id: req.params.userId }
          }]
        });

        console.log(`getAllPostsOfUser postCollection: ${JSON.stringify(postCollection)}`);
        // return all posts of the user to the client
        return res.status(200).json({
          success: true,
          posts: postCollection
        });
      } else {
        // if the user's request was not completed successfully
        return res.status(404).json({
          success: false,
          message: 'User Not Found'
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },

  // function for requesting the number of all posts and pages
  async countAllPosts(req, res) {
    try {
      // request the number of all posts
      const postsCount = await Post.count();

      console.log(`countAllPosts postsCount: ${postsCount}`);
      // calculating the number of pages using the number of posts per page
      let pagesCount = Math.ceil(postsCount / perPage);
      // return the number of all posts and pages to the client
      return res.status(200).json({
        success: true,
        postsCount: postsCount,
        pagesCount: pagesCount
      });

    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },

  // function for requesting recent posts
  async recentPageOfPosts(req, res) {
    try {
      // get the latest posts from the database in descending order
      const postCollection = await Post.findAll({
        attributes: ['id', 'title', 'content', 'userId'],
        limit: 5,
        order: [['updatedAt', 'DESC']]
      });

      console.log(`recentPageOfPosts postCollection: ${JSON.stringify(postCollection)}`);
      // return the latest posts to the client
      return res.status(200).json({
        success: true,
        posts: postCollection
      });

    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },

  // function for requesting posts by page number
  async PageOfPosts(req, res) {
    try {
      // calculating the offset of the number of posts for query
      const offset = req.params.page * perPage - perPage;
      // request posts by offset & limit
      const postCollection = await Post.findAll({
        attributes: ['id', 'title', 'content', 'userId'],
        offset: offset,
        limit: perPage,
        order: [['updatedAt', 'DESC']]
      });

      console.log(`PageOfPosts postCollection: ${JSON.stringify(postCollection)}`);
      // return the posts by page number to the client
      return res.status(200).json({
        success: true,
        posts: postCollection
      });

    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },

  // function for creating a new post
  async createPost(req, res) {
    try {
      console.log(`createPost req.body: ${JSON.stringify(req.body)}; req.userId: ${JSON.stringify(req.userId)}`);
      // deconstructed title & content from request body
      const { title, content } = req.body;
      // TO-DO: validate isEmpty -  content & title
      // create object for creating a new post
      const post = {
        title: title,
        content: content,
        userId: req.userId,
      };
      // request for creating a new post
      const newPost = await Post.create(post);
      console.log(`createPost newPost: ${JSON.stringify(newPost)}`);
      // return the new post to the client
      return res.status(201).json({
        success: true,
        post: newPost
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },

  // function for updating the post
  async updatePost(req, res) {
    try {
      console.log(`updatePost req.body: ${JSON.stringify(req.body)}; req.userId: ${req.userId}`);
      console.log(`updatePost req.body.userId: ${req.body.userId}`);
      // deconstructed title, content, postId, userId from request body
      const { title, content, postId, userId } = req.body;
      // check if the user is the owner of the post
      if(userId != req.userId) {
        return res.status(403).send("You have no credentials to do this!");
      }
      // TO-DO: validate isEmpty -  content & title
      // create object for updating the post
      const updatePostContent = {
        title: title,
        content: content,
        postId: postId,
      };
      console.log(`updatePost updatePostContent: ${JSON.stringify(updatePostContent)}`);
      // check if the post exist in database by id
      const post = await Post.findByPk(
        postId
      );

      if(post) {
        console.log(`updatePost Post Found: ${JSON.stringify(post)}`);
        // request for updating the post
        const updatedPost = await Post.update(
          updatePostContent, {
            where: {
                id: postId
            }
        });

        console.log(`updatePost updatedPost: ${JSON.stringify(updatedPost)}`);
        console.log(`updatePost updatedPost[0]: ${updatedPost[0]}`);
        // return the updated post to the client
        return res.status(201).json({
          success: true,
          post: updatedPost
        });
      } else {
        // if the post does not exist in database
        return res.status(404).json({
          success: false,
          message: 'Post Not Found'
        });
      }

    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },

  // function for deleting the post
  async deletePost(req, res) {
    try {
      console.log(`deletePost req.body: ${JSON.stringify(req.body)}; req.userId: ${req.userId}`);
      // deconstructed postId from request body
      const { postId } = req.body;
      // request the post by id
      const post = await Post.findOne({
        where: {id: postId}
      });
      console.log(`deletePost Post Found: ${JSON.stringify(post)}`);

      if(!post) {
        // if the post does not exist in database
        return res.status(404).json({
          success: false,
          message: 'Post Not Found'
        });
      }
      // check if the user is the owner of the post
      if(post.userId != req.userId) {
        return res.status(403).json({
          success: false,
          message: "You have no credentials to do this!"
        });
      }
      // request for deleting the post
      const deletedPost = await Post.destroy({
          where: { id: postId }
      });
      console.log(`deletePost deletedPost: ${JSON.stringify(deletedPost)}`);

      // return the success message to the client
      res.status(200).json({success: true, message: "Post deleted successfully"});

    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },
}