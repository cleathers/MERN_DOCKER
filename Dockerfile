FROM mhart/alpine-node:7

RUN npm install -g express express-generator webpack

WORKDIR /var/www
