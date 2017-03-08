# Server
##setup
``npm init``
- open the conf.js file and set your username and password, if no file exists see the sample conf.js contents below and copy paste it into a conf.js file

``node app.js``
- connect @ **https**://localhost:3000

##Users API
###Registering A New User
- description: register a new user
- request: `POST /users/`
  - content-type: `application/json`
  - body: object
    - username: (string) the username
    - password: (string) the password
- response: 200 | 500 if server error | 409 if user already exists
  - content-type: `application/json`
  - body: object
    - username: the username of new user


**example request body (postman)**,
```
{
  "username": "test2",
  "password": "test2"
}
```

###Logging In
- description: register a new user
- request: `POST /signin/`
  - content-type: `application/json`
  - body: object
    - username: (string) the username
    - password: (string) the password
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: object
    - username: (string) the username of user
    - token: (string) the token used to authenticate in other methods
    - expiresIn: (int) when the token expires in seconds


**example request body (postman)**,
```
{
	"username": "test2",
	"password": "test2"
}
```
##Location API
###Setting A users location
- description: register a new user
- request: `PUT /api/location`
  - content-type: `application/json`
  - body: object
    - token: the request token (recommend sending in body or header)
    - username: (string) the username
    - longitude: (number) the longitude
    - latitude: (number) the latitude
    - height: (number) the height
 - response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: object
    - longitude: (number) the longitude
    - latitude: (number) the latitude
    - height: (number) the height


  **example request body (postman)**,
  ```
  {
  	"token": "the token",
  	"username": "username",
  	"longitude": 100,
  	"latitude": 100,
  	"height": 100
  }
  ```

##Sample conf.js file
```
var username = 'daniel';
var password = 'daniel123';

var conf = {
  mongouri: "mongodb://" + username + ":" + password + "@ds119750.mlab.com:19750/freetime"
};

module.exports = conf;
```
