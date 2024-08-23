const mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    status:{type:String,enum:['pending','completed'],default:"pending"},
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'User'},   
},{
    versionKey:false,
    timestamps:true
})

const TaskModel=mongoose.model("Task",taskSchema);

module.exports=TaskModel;