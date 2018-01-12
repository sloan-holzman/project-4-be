# Virtual Wallet

## Table of Contents

- [Description of the project](#description-of-the project)
- [Technologies used](#technologies-used)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Deployment instructions](#deployment-instructions)
  - [Local deployment](#local-deployment)
  - [Production deployment](#production-deployment)
- [User Stories](#user-stories)
- [Remaining to-do's](#remaining-to-do's)


## Description of the project

The project is a website that allows user to save digital copies of their gift cards (and coming soon, coupons), so that they don't lose them.  Features include:

* Login with Twitter: using Oauth to manage the process
* Full CRUD on gift cards/coupons: users can create, read, update, and delete their digital gift cards (and soon coupons)
* Filtering by retailer: users can search for their gift cards/coupons by vendor
* Links: The site automatically creates custom links (by retailer) to check how much value is remaining on each gift card and to find additional discounted gift cards or coupons (by retailer)
* Bar code generation: Based on the card number entered, the site autogenerates a barcode that can be scanned on their mobile devises
* Alerts: The site shows alert messages when the user logs in, creates/edits/deletes a card, or experiences an error (generally when pinging the backend)
* Mobile responsiveness: The site is adjusts to smaller screens to ensure visibility on smartphones and tablets.

Note that the site is broken into two repos, the frontend and backend:

* Frontend Repo:  https://github.com/sloan-holzman/project-4-fe
* Backend Repo:  https://github.com/sloan-holzman/project-4-be

The fully functioning site can be found here: http://virtual-wallet.surge.sh/

## Technologies used

### Backend

#### Technologies used

* express - to create a backend server
* mongoose - to manage the NoSQL database
* body-parser - to parse incoming requests
* cors - to manage access from the frontend
* express-jwt - to authenticate twitter logins
* jsonwebtoken - to encrypte and unencrypte tokens sent to the frontend
* passport - to develop strategies for managing requests/authentication
* passport-twitter-token - to give passport the specific twitter token authentication strategy
* request - to make api calls to twitter during authentication


#### Installation Instructions

1. I installed all technologies using npm...
2. you need to first run `npm init -y` to create the package.json file
3. then you can install `npm install express` and all the other dependencies

### Frontend

#### Technologies used

* react - to build the user interface
* react-dom - to handle DOM-related rendering patterns
* react-router-dom- to handle routing
* react-redux- to manage state
* react-scripts- to enable commands like start (to locally launch the frontend) and build (to compile before deploying)
* react-twitter-auth- to provide a twitter login component that interacts with twitter and the backend during authentication
* react-logger- to log actions
* react-thunk- to let us dispatch functions for redux
* axios - to make API calls
* babel-polyfill - to give us access to certain JS functionality like promises
* materialize-css - to provide pre-built css styling for the site
* jquery - to enable certain functionality from materialize
* material-ui - to provide a few pre-built, stylized components (e.g. the autocomplete search field)
* moment - to format dates
* react-barcode - to generate bar codes out of gift card numbers
* react-card-flip - to enable the card flips ui

### Installation instructions for all dependencies

1. I installed all dependencies using npm...
2. if you haven't already, you need to first run `npm i -g create-react-app` then run `create-react-app` following by the app-name (or just `.`) if you want to create in the current folder
3. then you can install all other dependencies using npm

## Deployment instructions

### Local deployment

* You must first register a twitter app and enable access to the user's email.  Instructions can be found here (https://medium.com/@robince885/how-to-do-twitter-authentication-with-react-and-restful-api-e525f30c62bb) under the 'Creating a new Twitter application' section.  For the callback, put http://127.0.0.1:3000/
* On the backend, you must create a file called twitter.config.js (not included in this repo) with the following structure:
  module.exports = {
    consumerKey: 'TWITTER_CONSUMER_KEY',
    consumerSecret: 'TWITTER_CONSUMER_SECRET',
    oauth_callback: 'http://127.0.0.1:3000/',
    secret: 'YOUR_MADE_UP_SECRET_FOR_TOKEN_ENCRYPTION' (NOTE: in a production environment, you should use a proper hashing algorithm)
  };
* On the frontend: you just need to make sure that the BackEndVariable.js file reads `let backend = "http://localhost:1337/";`
* node or `nodemon index.js` the backend and `npm start` the frontend to kick it off locally
* NOTE: the twitter authentication will not work at `http://localhost:3000/`.  Instead, just open a new tab at `http://127.0.0.1:3000/`

### Production deployment

* I used Heroku to deploy my backend (with mLab hosting the database) and Surge to host my frontend.  You can use whatever hosting platforms you prefer.  But, before deploying you need to...
* change the Callback URL for your twitter app (at https://apps.twitter.com/) to the URL of the frontend site (in my case, to http://virtual-wallet.surge.sh/)
* change the oauth_callback variable in twitter.config.js to the frontend url
* change BackEndVariable.js to point to the URL where the backend is hosted

## User stories

* User has a bunch of gift cards and/or coupons in drawers, but cannot keep track of them and might lose them
* User does not know how much money is left on his/her gift card
* User can't keep track of when gift cards and/or coupons are about to expire
* User want to go shopping at a particular retailer and wants to search for discount gift cards or coupons before making a purchase

## Remaining to-do's

* Add in coupons, in addition to gift cards (materializecss is conflicting with jquery, preventing me from creating a simple dropdown to select gift card or coupon. will have to sort out)
* Allow login with google and/or facebook, too
* Fully optimize for mobile, ensuring users can easily zoom in and have an individual gift card or coupon can take up the full screen
* Abstract data fetching, alerts, and some other key functions into a services folder to make the code more DRY and easier to follow (frontend)
* Abstract the EditCard and NewCard components into one component with different props passed in (frontend)
* Re-organize the css, possibly breaking out into multiple files (frontend)
* Add prototypes to ensure the correct data types are being passed in (frontend)
* Fix the "updated day" from being off by one day (frontend)
* Send email reminders when gift cards / coupons are about to expire (frontend and backend)
* Confirm if a card already exists before creating a new one (frontend or backend)
* Update CORS restrictions (backend)
* Abstract out some key function to make code more DRY, particularly for unencrypting the tokens and finding the user on each request (backend)
* Continue to refactor to break larger functions into sets of micro-functions (frontend and backend)
* Write out tests (which I should have done first!)
