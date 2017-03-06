# Server
##setup
``npm init``
- open the conf.js file and set your username and password  

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

```
curl -X PUT -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 1c19fbae-267c-ddfe-6076-c7755ab01356" -d '{
	"username": "test",
	"password": "test"
}' "https://localhost:3000/api/users"
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

###testing auth works
``GET "/api/testauth"``
send token using ?token="token" or body or header
returns 200 if successful
