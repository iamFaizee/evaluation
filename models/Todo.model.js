const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    taskname: {type: String, required: true},
    status: {type: String, enum: ['pending', 'done'], default: 'pending'},
    tag: {type: String, enum: ['personal', 'official', 'family'], default: 'personal'},
})

const Todomodel = mongoose.model('todos', todoSchema)

module.exports = {Todomodel}