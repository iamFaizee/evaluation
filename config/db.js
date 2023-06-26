const mongoose = require('mongoose')

const connection = mongoose.connect(process.env.MONGO_CONNECTION)
.then((res) => {
    console.log('connection established')
})
.catch((err) => {
    console.log('error connecting to DB')
})


module.exports = {connection}