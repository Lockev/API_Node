const http = require("http");
const app = require("./app");

const port = process.env.PORT || 3000; // La var process.env.PORT est le port par defaut de l'hebergeur sinon c'est 3000
const host = process.env.HOST || "0.0.0.0"; // La var process.env.HOST est l'host par defaut de l'hebergeur sinon c'est 0.0.0.0

http.createServer(app).listen(port, host, () => {
  console.log("Server ready at http://" + host + ":" + port);
});
