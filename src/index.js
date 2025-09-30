
const PORT = process.env.PORT || 3000;

// COnnect to the database

// Activate express server
const {app} = require('./server')

app.listen(PORT, () => {
    console.log("The server is running on port: " + PORT)
})