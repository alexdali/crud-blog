Test task (BackEnd) app

Requirements for the implementation language: NodeJS 12
Recommended libraries/tools: 
 * DB ORM - sequelize
 * WebServer - express/koa
  
The task is to write a back-end for the application implementing the "guestbook", which must provide:
 * User registration
  * User authorization
  * Creating a post (text message)
 * Deleting a post by the user who created it
  * Display posts with 5 posts per pagination page
  * Display a list of users

Necessary:  
 * Design and implement 2 DB tables-users and posts
 * Methods required for implementation:
 POST /login-Parameters: userName, password. Provides authorization for the user.
 POST /register-Parameters: userName, password. Provides user registration.
 GET /posts/count-Returns the total number of messages and pages.
 GET /posts/list-Returns the first page (the last 5 messages). Contains the message text, message id, and user id
 GET /posts/list/{page} - Returns {page} page (each page contains 5 messages). Contains the message text, message id, and user id
 POST /post/new-Parameters: postText. Creating a new message
 POST /post/delete-Parameters: postId. Deletes a message by its id. only the user who created it can delete it
 GET /user/list-Displays a list of all users (only userName and id)

Returns all methods in JSON format
In the implementation to use the async/await (not through .then promise)
The users and posts tables must have a relational relationship
