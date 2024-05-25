const express = require("express");
const http = require('http');
const { getConnection } = require('./db');

const app = express();
const server = http.createServer(app);

app.use(express.json());

async function startApp(){
    const data =  await getConnection();
    console.log(data.collections);
}

startApp();

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
