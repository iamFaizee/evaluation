const jwt = require('jsonwebtoken')

const authentication = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.json({error: 'Please Login'})
    }

    jwt.verify(token, process.env.SECRET, (err,decoded) => {
        const {userId} = decoded;

        req.userId = userId

        if(decoded){
            next();
        }
        else{
            res.json({error: 'Please Login'})
        }
    })
}

module.exports = {authentication}