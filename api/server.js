const express = require('express');
const {logger} = require("./middleware/middleware.js");

const server = express();

// ekspres'in varsayılan olarak istek gövdelerinde JSON'u ayrıştıramayacağını unutmayın

// global ara yazılımlar ve kullanıcı routelarının buraya bağlanması gerekir
const userRouter = require("./users/users-router.js");
server.use(express.json());
server.use(logger);//logger her istek için çalıscak
server.use("/api/users", userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Biraz ara yazılım yazalım!</h2>`);
});

module.exports = server;
