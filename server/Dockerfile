FROM node:18 as base
# Create app directory
WORKDIR /server
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

FROM base as build

WORKDIR /server

# Bundle app source
COPY . .

# Build the app
RUN npm run tsc


FROM node:18-alpine

WORKDIR /server

COPY package*.json ./

RUN npm i -g npm@latest

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm ci --omit=dev

COPY --from=build /server/dist ./dist
RUN ls dist
RUN chown -R node:node /server

USER node

# Expose the port the app runs on
EXPOSE 5000

# Serve the app
CMD [ "node", "dist/server.js" ]