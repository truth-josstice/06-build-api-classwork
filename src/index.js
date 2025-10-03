const PORT = process.env.PORT || 3000;

const { dbConnect } = require("./database/connectionManager");
// COnnect to the database

// Activate express server
const { app } = require("./server");

// Connect to database
dbConnect().then(() => {

  // Activate the express server
  app.listen(PORT, () => {
    console.log("The server is running on port: " + PORT);
  });
});
