#

<h1 align='center'>DevSpeak Blog</h1>

<div align="center">
  <a title="Firebase" href="https://firebase.google.com/"><img width="100" height="50"  src="https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg" ></a>
  <a title="JavaScript" href="https://developer.mozilla.org/es/docs/Web/JavaScript"><img  src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"></a>
<a title="react" href="https://es.react.dev/"><img width="80" src="https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg"></a>
<a title="Nodejs" href="https://nodejs.org/"><img width="80" height="40"  src="https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg"    ></a><a title="express" href="https://expressjs.com/"><img  src="https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg" height="50"></a>
<a title="tailwind" href="https://tailwindcss.com/"><img width="80" src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-ar21.svg"></a></a>
<a title="mongoDB" href="https://www.mongodb.com/atlas/database><img width="80" src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg"></a>

[Project Overview](#project-overview) •
[Key Features](#key-features) •
[Deployment](#deployment) •
[Setup Instructions](#setup-instructions) •
[Contributing](#contributing) •
[License](#license) •

</div>

---

<a name='project-overview'></a>

## Project Overview

DevSpeak is a full-stack blog application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It provides a platform for developers to share their insights, experiences, and knowledge with the community.

---

<a name='key-features'></a>

## Key Features

- Visually Attractive Design: Crafted for a visually engaging and pleasing user experience.

- Fully Responsive: Ensures seamless functionality across various devices for a consistent user experience.

- Dark Mode: Allows users to toggle between light and dark modes for a personalized viewing experience.

Advanced Search Filters:

- Search by Categories: Users can filter posts by predefined categories.
- Keyword Search: Perform keyword searches to find specific articles.

Authentication:

- Email and Password: Users can register and log in using their email and password.
  Google Authentication: Support for signing in with Google accounts.

User and Admin Modes:

User Mode:

- Commenting: Users can create, edit, delete comments and like posts.

Admin Mode:

- Blog Management: Create, edit, and delete blog posts.
  Dashboard: Admin dashboard provides an overview of posts, comments, and users.

<a name='deployment'></a>

## Deployment

The project is deployed and accessible at https://devspeak.onrender.com

---

<a name='setup-instructions'></a>

## Setup Instructions

### Clone the Repository:

- git clone https://github.com/P666R/DevSpeak-MERN.git

### Install Dependencies:

- cd DevSpeak-MERN
- npm install
- cd DevSpeak-MERN/client
- npm install

### Set Environment Variables:

- Create a .env file in the root directory and add the following variables:

  1. PORT=3000
  2. NODE_ENV=development
  3. MONGODB_URL=your-mongodb-url
  4. JWT_SECRET=your-secret-key-for-jwt

- Create a .env file in the client directory and add the following variables:
  1. VITE_FIREBASE_API_KEY=your-firebase-api-key

### Run the Application:

- Backend: cd DevSpeak-MERN -> npm run dev
- Frontend: cd DevSpeak-MERN/client -> npm run dev

### Access the Application:

- Open your browser and navigate to http://localhost:3000 to access DevSpeak.

---

<a name='contributing'></a>

## Contributing

Contributions are welcome! Feel free to open issues or pull requests to help improve the project.

<a name='license'></a>

### License

This project is licensed under the MIT License.
