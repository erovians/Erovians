import mongoose ,{ Schema } from 'mongoose';


const TaskAndProjectSchema = new Schema({

    title: { type: String, required: true  },
    description: { type: String },
    status: { type: String, enum: ['To Do', 'Doing', 'Review', 'Done'], default: 'To Do' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
})

export default mongoose.model('TaskAndProject', TaskAndProjectSchema);