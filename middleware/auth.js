const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = (req, res, next) => {
    console.log("Auth")
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if(!token){
        res.status(403).send("Um token é necessario para a autenticação.");
    }
    try{
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
        console.debug(req.user)


    } catch(err){
        return console.error(err)
    }
    console.debug("PASSED AUTH " +token)
    return next()
}

module.exports = verifyToken