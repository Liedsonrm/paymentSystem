const mongoose = require("mongoose");

const {MONGO_URI}  = process.env;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
      useUnifiedTopology: true
})
    .then(() => {
        console.log("Sucessfully connect to the database!");
    })
    .catch((error) => {
        console.log("Database connection failed... exiting now");
        console.error(error);
        process.exit(1)
    })

