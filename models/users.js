import mongoose, { model } from 'mongoose'

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    // workspaces: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "Workspace"
    // }]
}, { timestamps: true });

const Users = mongoose.model('Users', usersSchema);

export default Users;
