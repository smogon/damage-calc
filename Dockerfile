FROM node:12 as build
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

WORKDIR /usr/src/app/calc
COPY calc/package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

WORKDIR /usr/src/app
COPY . .
RUN node build


FROM nginx

COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html

