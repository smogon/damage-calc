FROM node:12 as build
# Create app directory
WORKDIR /usr/src/app/calc

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY calc/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY package*.json ./

COPY . .
RUN node build


FROM nginx

COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html

