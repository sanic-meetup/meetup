# base image
FROM node

# create the application directory
RUN mkdir -p /home/nodejs/app
# copy the application
COPY ./server/api /home/nodejs/app
COPY ./server/README.md /home/nodejs/README.md
# move to working directory
WORKDIR /home/nodejs/app
# install all npm modules
RUN npm install --production
RUN npm install -g nodemon
# run the nodejs application
CMD nodemon app.js
