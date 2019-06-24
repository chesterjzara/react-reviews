This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Link to backend API repo - https://github.com/chesterjzara/api-reviews

## Friendly Reviews App

This is a small application where users can look up places and record their own rating and recommendation/review for that place. They can also add friends and reviews of other users will only be visible if you are friends. The idea is that one good review from a close friend is often worth more than essentially anonymous reviews from people you don't know.

Additionally, there is functionality to help choose a place to go when with a group of friends. You can select the friends present and the app will make a suggestion based on places your friends have reviewed.

## Technology Used / Credits

* Javascript
* React
  * react-router
  * react-select
  * react-bootstrap
  * google-maps-react
  * dotenv
* Google Maps and Places API
* CSS + Bootstrap
* Node.js - Express server
  * bcrypt, cors, dotenv, express, jsonwebtoken, morgan, pg
* PostgreSQL database
* Deployed on Heroku

All mapping data and images from Google
Stock images from unsplash - https://unsplash.com/

## User Stories

User auth/onboarding
 * User should hit a Welcome page and be directed to register, login, or check out a guest user
 * User will be able to register with their name, email and password - and be signed in once submitted
 * User will be able to login with email and password and be direct to the Home Dashboard
 * User will be warned if submitting invalid account info

User Friend Workflows
 * User can search for other users on the Friend page to friend request and send a request
 * User can view the sent requests on their Friends page and cancel a request if needed
 * Users can see incoming requests on their Friend page and accept or reject them
 * Users will see a list of their friends on the Friend page
 * Users can click a user on the Friend page to see an individual friend's page with recent reviews and option to unfriend/friend/cancel request
 
Places Reviews Workflows
  * Users are able to view their entered places on the Places page
  * Users see their confirmed friends' places on the Places page
    * A place can be viewed to see all friend reviews and information about the place (image, name, address, google maps link)
  * Users are able to edit their review on a place
  * On an individual place page users can filter reviews by the tags
  * Users are able to locate a new place with the google maps input 
    * Users are able to tag, rate and review a given place

Search / Suggest
 * From the Home Dashboard users are able to search on a keyword for places/users
 * Users are able to get suggestions based on which friends they are with and which tags they want to limit their search to
 
 
## Additional Improvements / Features

See the Issues of this repo for the full list. A few key future features:
 * Custom styling - so things don't look totally bootstrappy
 * More intellgient suggestion engine - search ranking, proximity weighting, suggest new places not yet visited
 * Support for multiple tags per review
