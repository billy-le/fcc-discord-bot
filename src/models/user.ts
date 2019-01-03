import mongoose, { Schema } from 'mongoose';

// Model schema
const userSchema = new Schema({
    githubId: { type: String, unique: true },
    username: String,
    displayName: String
});

// Model class, corresponds to a Mongo collection
// The model is loaded into Mongoose and doesn't need to be exported
const userClass = mongoose.model('users', userSchema);

// Export the model... not necessary
// export default userClass;
