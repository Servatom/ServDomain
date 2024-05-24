FROM node:18
# Create app directory
WORKDIR /server
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install TypeScript globally
RUN npm install -g typescript

# RUN npm install
# If you are building your code for production
RUN npm ci --omit=dev
# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Serve the app
CMD [ "node", "dist/server.js" ]