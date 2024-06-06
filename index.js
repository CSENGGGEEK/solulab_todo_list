// Import required modules
const express = require("express");
const http = require("http");
const logic = require("./todoListLogic");
const { getConnection } = require("./db");
const session = require("express-sessions");
const { secretKey } = require("./config");

// Create Express app
const app = express();
const server = http.createServer(app);

// Serve static files from the 'static' directory
app.use(express.static(__dirname + "/static"));

// Set the view engine to Pug and define views directory
app.set("view engine", "pug");
app.set("views", "./views");

// Parse JSON bodies
app.use(express.json());

app.use(
  session({
    // Forces the session to be saved back to the session store
    resave: true,

    // Save the session uninitialized to the session store
    saveUninitialized: true
  })
);

// Mount routes from todoListLogic module
app.use("/", logic);

// Define function to start the application
async function startApp() {
  try {
    const data = await getConnection();
    console.log(data.collections);
  } catch (error) {
    console.error("Error starting the application:", error);
  }
}

// Start the application
startApp();

// Define port for the server
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
