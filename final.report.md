# Team Sanic Project Final Report
this is a copy of our proposal that has been updated to reflect our progress
<!-- -----
This is the project proposal for Team Sanic, we submit two proposals (proposal \#1 and \#2 respectively). Proposal \#1 is our main idea and Proposal \#2 is our backup Idea.

----- -->
### Team Members
- Daniel Persaud (<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu_psdppsyLMN0iFDBxy0jRhdKff1VQrKtZpfXorJeFdSkzf6hK96U-Lc" width="30px" height="auto"/>persa188)
- Brandon Mowat (<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu_psdppsyLMN0iFDBxy0jRhdKff1VQrKtZpfXorJeFdSkzf6hK96U-Lc" width="30px" height="auto"/>brandonmowat)
- Kirisanth Ganeshamoorthy (<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu_psdppsyLMN0iFDBxy0jRhdKff1VQrKtZpfXorJeFdSkzf6hK96U-Lc" width="30px" height="auto"/>kirisanth-g)

### Project Name
The project name is **Free Time**

### App. Description
A React Native app that broadcasts your availability and location to your friends.

## Features
### Key Features (BETA)
- [x] locating the app user
- [x] RESTful API that can successfully let the user know who's nearby
- [x] RESTful API: friends list (adding ,removing, viewing), user logins (OAuth or Phone #'s or UserName + Pass), accounts, profiles, user status, etc.
  - profiles not implemented on client due to time restrictions
  - status limited to busy/available due to time restrictions
- [x] A usable front-end that allows the user to make use of above features meaningfully

### Additional Features (Final Ver.)
- [x] polished web-app and mobile app.
  - the mobile app is as polished as we could get it given we did not know REACT/REACT Native
- [x] features not completed in BETA
- [x] polished backend
- [x] user location height location
- [ ] push notifications (for various stuff)
  - implemented on backend only

## Technology Stack 
- [x] React/ React Native (for mobile app)
- [x] Node.js/Express/Passport
  - jsonWebToken used instead of Passport as we opted to go with token authentication
- [ ] OAuth
  - decided not to use, may implement in future iterations though
- [x] HTML/CSS/JS/JSX
- [ ] Native Swift (for when React Native isn't sufficient)
  - ended up not needing Native Code
- [x] Google Maps API
  - opted for native map client instead (Apple Maps for iOS / Google Maps for Android) this is for easier apple core location support
- [x] Apple Core Location (for height location in buildings)
- + Mocha, Chai, SuperTest, & chai-http for server side testing
- + sendgrid for mailing things to users
  - implemented on  backend, not  being used on front-end due to time constrictions
- + Mongoose & MongoDB (hosted on MLab)


### Technical Challenges
- [x] Learning React (and Native) FrameWorks
- [x] Learning and Setting up Google Maps (& Apple Maps) API
- [x] Learning and Setting up Apple Core location
- [ ] (optional) Learn & work with Swift for iOS app
- [x] Deploying and configuring RestAPI to work with mobile devices

<!--##Proposal \#2
###Project Name
The project Name is **CMYK Buyer** (subject to change)
-->
