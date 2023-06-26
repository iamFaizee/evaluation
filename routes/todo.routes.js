const express = require('express')

const { Todomodel } = require('../models/Todo.model')
const { authentication } = require('../middleware/authentication')

const todoRouter = express.Router()

todoRouter.use(authentication)


todoRouter.get('/', async (req, res) => {
    try {
        const query = req.query;
        const userIds = req.userId;
        console.log(query, userIds)
        const todos = await Todomodel.find({author_id: userIds, ...query});

        // console.log(userId)
        res.json(todos)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' })
    }
})


todoRouter.post('/create', async (req, res) => {
    try {
        const { taskname, status, tag } = req.body;
        const author_id = req.userId;

        const todo = new Todomodel({
            taskname,
            status,
            tag,
            author_id,
        })
        await todo.save()
        res.status(200).json({ success: 'todo created successfully' })

    } catch (error) {
        res.status(500).json({ error: 'creating todo failed' })
    }
})


todoRouter.put('/update/:todoId', async (req,res) => {
    const {todoId} = req.params
    const { taskname, status, tag } = req.body;
    const userId = req.userId;

    try {
        const todo = await Todomodel.findOne({_id: todoId});
        const author_id = todo.author_id;

        if(author_id === userId){
            todo.taskname = taskname;
            todo.status = status;
            todo.tag  = tag;

            await todo.save();
            res.json({success: 'Todo updated successfully'})
        }
        else{
            res.json({error: 'You are not allowed to update this task'})
        }

    } catch (error) {
        console.log(error)
        res.json({error: 'Internal Server error'})
    }
})


todoRouter.delete('/delete/:todoId', async (req,res) => {
    const {todoId} = req.params
    const userId = req.userId;

    try {
        const todo = await Todomodel.findOne({_id: todoId});
        const author_id = todo.author_id;

        if(author_id === userId){

            await Todomodel.findOneAndDelete({_id: todoId});
            res.json({success: 'Todo deleted successfully'})
        }
        else{
            res.json({error: 'You are not allowed to delete this task'})
        }

    } catch (error) {
        console.log(error)
        res.json({error: 'Internal Server error'})
    }
})




module.exports = { todoRouter }