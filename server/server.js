const http = require("http");
const app = require("./app");
require("dotenv").config();

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
