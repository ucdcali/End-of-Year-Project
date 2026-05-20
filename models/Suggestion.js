import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
    name: String,
    description: String
});

export const Suggestion = mongoose.model('Suggestion', suggestionSchema);
