require("dotenv").config();
require('./config/database.js')

const cors = require('cors')
const User =  require("./model/user")
const routes = require('./routes/router')
const express = require('express');

const app = express();

app.use(cors())
app.use(express.json());
app.use(routes)










app.listen(process.env.PORT, () => {
    console.log("Server running on port "+ process.env.PORT)
})
