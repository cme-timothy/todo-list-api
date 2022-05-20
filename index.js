const http = require("http");

const port = 5000;

const server = http.createServer((req, res) => {
  res.end();
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
