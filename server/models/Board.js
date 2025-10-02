const mongoose = require('mongoose');
const {Schema} = mongoose;

const boardSchema = new Schema({
    boardName: {
        type: String,
        required: true,
        trim: true,
    },
    boardData: {
        type: Object,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
},{
    timestamps: true,
});

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;