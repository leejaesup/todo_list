const Task = require("../model/Task");
const taskController = {};

//CREATE(POST)
taskController.createTask = async (req, res) => {
    try {
        const {task, isComplete} = req.body;
        const {userId} = req;
        // const newTask = new Task({task, isComplete});
        const newTask = new Task({task, isComplete, author: userId});
        await newTask.save();

        //200 Ok
        res.status(200).json({status: "ok", data: newTask});
    } catch (err) {
        //400 Bad Request
        res.status(400).json({status: "fail", error: err});
    }

}

//READ(GET)
taskController.getTask = async (req, res) => {
    try {
        // const taskList = await Task.find({}).select("-_id -__v");
        // const taskList = await Task.find({}).populate("author").select("-__v");
        const taskList = await Task.find({}).populate("author");
        console.log("taskList = ", taskList);

        res.status(200).json({status: "ok", data: taskList});
    } catch (error) {
        res.status(400).json({status: "fail", message: error.message});
    }
}

//UPDATE(PUT)
taskController.updateTask = async (req, res) => {
    try {
        const updateTask = await Task.findById(req.params.id);

        if (!updateTask) {
            return res.status(404).json({ status: "fail", error: "Task ID를 찾을 수 없습니다." });
        }

        const fields = Object.keys(req.body);

        fields.map((item) => (
            updateTask[item] = req.body[item]
        ));
        await updateTask.save();

        res.status(200).json({status: "ok", data: updateTask});
    } catch (err) {
        res.status(400).json({status: "fail", error: err});
    }
}

//DELETE(DELETE)
taskController.deleteTask = async (req, res) => {
    try {
        const deleteItem = await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: "success", data: deleteItem });
    } catch (error) {
        res.status(400).json({ status: "fail", error });
    }
}

module.exports = taskController;
