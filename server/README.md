# Server
## Current HTTPS Endpoint(s)
``https://api.sanic.ca`` (signed certificate, suitable for production use, hosted on cms-weberver use for grading)

``https://sanic.ca:2096`` (signed certificate, suitable for production use)

<!-- ``https://kmain.ddns.net:81`` (self-signed unverified certificates, not suitable for production use)

``https://server.sanic.ca:2096`` (self-signed unverified certificates, not suitable for production use) -->

<!-- ## Current HTTP Endpoint(s) ~ (Temp endpoints for debugging & testing, REMOVE for production)
``http://kmain.ddns.net:82`` -->

**http requests disabled for sanic.ca**

## Memcached Server(s)
- not yet impl

## local setup
``npm install``
- open the conf.js file and set your username and password, if no file exists see the sample conf.js contents below and copy paste it into a conf.js file or copy the conf.js file in the root of this repo (change the credentials though)

``node app.js``
or
``nodemon app.js``
- connect @ **https**://localhost:3000

## Api Documentation
see [here](./api.docs.md)

## Sample conf.js file
```
var username = 'username';
var password = 'password';

var conf = {
  mongouri: "mongodb://" + username + ":" + password + "@ds119750.mlab.com:19750/freetime"
};

module.exports = conf;
```
