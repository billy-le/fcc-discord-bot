import mongoose, { Schema } from 'mongoose';

const commandSchema = new Schema({
    name: { type: String, unique: true },
    description: String,
    responses: String
});

const commandClass = mongoose.model('commands', commandSchema);
