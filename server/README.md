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
    - email: (string) an email
- response: 200 | 500 if server error | 409 if user already exists
  - content-type: `application/json`
  - body: object
    - username: the username of new user

**example request body (postman)**,
```
{
  "username": "test2",
  "password": "test2",
  "email": "mail@domain.com"
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

```


###Get User Info
- description: Get info for the current/given user
- request: `GET /api/user/`
  - query:
    - token: the request token
    - username: username that differs from current user (optional)
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: object
    - usernames: (string) the username
    - location: user's location
      - longitude: (number) the longitude
      - latitude: (number) the latitude
      - height: (number) the height
    - status: user's status
      - availability: (enum) availability status
      - message: (string) status message
    - email: (string) email of the user
    - meta:
      - age: (number) age of the user
      - website: (string) website of the user

**example request body (postman)**,
```

```


###Follow a User
- description: follow another user
- request: `POST /api/follow/`
  - content-type: `application/json`
  - body: object
    - username: (string) the username of the person wished to follow
    - token: the request token (recommend sending in body or header)
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: None

**example request body (postman)**,
```

```


###Get List of Followers
- description: Get a list of followers of the current/given user
- request: `GET /api/followers/`
  - query:
    - token: the request token
    - username: username that differs from current user (optional)
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: list of object
    - usernames: (string) the username

**example request body (postman)**,
```

```

##Status & Location API
###Get Status/Location of Current Users
- description: Get the status & location of the current/given user
- request: `GET /api/status/`
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: object
    - availability: (enum) availability status
    - message: (string) status message

**example request body (postman)**,
```

```


###Set Status/Location of Current Users
- description: Set the status & location of the current/given user
- request: `PUT /api/status/`
  - content-type: `application/json`
  - body: object
    - availability: (enum) availability status
    - message: (string) status message
    - inform: (boolean) if followers should be notified
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: object
    - availability: (enum) availability status
    - message: (string) status message

**example request body (postman)**,
```

```


###Get Status/Location of Following Users
- description: Get the status & location of the user's the current/given user is following
- request: `GET /api/following/`
  - query:
    - token: the request token
    - username: username that differs from current user (optional)
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: list of object
    - username: (string) the username
    - location: user's location
      - longitude: (number) the longitude
      - latitude: (number) the latitude
      - height: (number) the height
    - status: user's status
      - availability: (enum) availability status
      - message: (string) status message

**example request body (postman)**,
```

```


###Setting A users location
- description: register a new user
- request: `PUT /api/location/`
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
