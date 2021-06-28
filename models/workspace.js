import mongoose, { model } from 'mongoose'

const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
    workspace: {
        type: String,
        required: true
    },
    member: {
        type: String,
        required: false
    },
    // owner: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Users"
    // }
}, { timestamps: true });

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
