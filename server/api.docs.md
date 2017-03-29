# Api Documentation
## Users API
### Registering A New User
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


### Logging In
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


### Get User Info
- description: Get info for the current/given user
- request: `GET /api/users/`
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
    - follows: (boolean) true iff current user follows the associated user

**example request body (postman)**,
```

```


### Follow a User
- description: follow another user
- request: `POST /api/users/follow/`
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


### Unfollow a User
- description: Unfollow another user
- request: `POST /api/users/unfollow/`
  - content-type: `application/json`
  - body: object
    - username: (string) the username of the person wished to unfollow
    - token: the request token (recommend sending in body or header)
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: None

**example request body (postman)**,
```

```


### Get List of Followers
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


### Check if following a User
- description: Giving a user check if the current user follows them. If user doesn't exist false is returned.
- request: `GET /api/following/check/`
  - query:
    - token: the request token
    - username: username of a user
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: object
    - follows: (boolean) true iff current user follows the associated user

**example request body (postman)**,
```

```


### Search for a User
- description: Get a list of users that match the given query
- request: `GET /api/users/search/`
  - query:
    - token: the request token
    - username: partial username
    - limit: the limit of returned results
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: list of objects
    - usernames: (string) the username
    - follows: (boolean) true iff current user follows the associated user

**example request body (postman)**,
```

```


### Delete a User
- description: Delete the current/given user
- request: `DELETE /api/users/`
  - query:
    - token: the request token
    - username: username of the current user (can differ for admin)
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.

**example request body (postman)**,
```

```


## Status & Location API
### Get Status of Current Users
- description: Get the status & location of the current/given user
- request: `GET /api/users/status/`
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: object
    - availability: (enum) availability status
    - message: (string) status message

**example request body (postman)**,
```

```


### Set Status of Current Users
- description: Set the status & location of the current/given user
- request: `PUT /api/users/status/`
  - content-type: `application/json`
  - body: object
    - availability: (enum: ["Available", "Busy", "Not Available"]) availability status
    - message: (optional, string) status message
    - inform: (optional, boolean) if followers should be notified
- response: 200 | 500 if server error | 401 if Unauthorized | 400 if bad req.
  - content-type: `application/json`
  - body: object
    - availability: (enum) availability status
    - message: (string) status message

**example request body (postman)**,
```

```


### Get Status/Location of Following Users
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


### Setting A users location
- description: register a new user
- request: `PUT /api/users/location/`
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
