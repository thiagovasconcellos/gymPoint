## GymPoint - Gym Management
Backend

## Getting started

### `yarn dev`

Runs the app in the development mode with nodemon.
This allows you to change something on the project and it instatly affects on how server works.

### `yarn queue`

Runs the queues apart from the API-server. This is awesome since you have two differents servers, one dealing with requests and the other dealing with jobs.

### How it works

Please notice that this project was developed for study purposes only.
In order to try things out, you should download this project and start the server on your machine.
Then have a look to the swagger [documentation](https://app.swaggerhub.com/apis/thiagovasconcellos/gym-point/1.0)

Once you're all set up, you can create a session with the following credentials:
* user: admin@gympoint.com
* pass: 123456

This will give you the token you'll need to acess most of requests.
Create students, memberships, then assign each other by using the /registrations route.

Everytime you assign a student to a membership, the user shall receive a e-mail with the membership details.
This work with questions answering as well.

The mailing is provide by nodemailer and uses background jobs, working apart from the API itself.

## Built with

* [Express](https://expressjs.com) - A web framework that let's you structure a web application to handle multiple different http requests at a specific url.
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Optimized bcrypt in JavaScript with zero dependencies. Compatible to the C++ bcrypt binding on node.js and also working in the browser.
* [jwt](https://www.npmjs.com/package/jsonwebtoken) - An implementation of JSON Web Tokens.
* [sequelize](https://sequelize.org/) - Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.
* [yup](https://www.npmjs.com/package/yup) - Yup is a JavaScript object schema validator and object parser. 
* [mongoDb](https://www.mongodb.com/) - The database for modern applications
* [postgres](https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database
* [nodemailer](https://nodemailer.com/about/) - Nodemailer is a module for Node.js applications to allow easy as cake email sending.
* [multer](https://github.com/expressjs/multer) - Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
* [bee-queue](https://github.com/bee-queue/bee-queue) - A simple, fast, robust job/task queue for Node.js, backed by Redis.
* [eslint](https://eslint.org/) - The pluggable linting utility for JavaScript and JSX
* [nodemon](https://nodemon.io/) - Nodemon is a utility that will monitor for any changes in your source and automatically restart your server. 
* [sucrase](https://www.npmjs.com/package/sucrase) - Sucrase is an alternative to Babel that allows super-fast development builds.
* [sentry](https://sentry.io/) - Open-source and hosted error monitoring that helps software teams discover, triage, and prioritize errors in real-time.



## Authors

* **Thiago Vasconcellos**

## Acknowledgments

* Thanks rocketseat! This is happening because of you guys!
