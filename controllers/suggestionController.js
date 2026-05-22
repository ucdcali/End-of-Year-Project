import { Suggestion } from '../models/Suggestion.js'

export const submitSuggestion = async (req, res) => {
    try {
        const { name, description} = req.body;
        const suggestion = await Suggestion.create({ name, description}); 
        console.log(suggestion)    
        res.redirect("/")
    }
    catch (err) {
        next(err)
    }
}

export const viewSuggestions = async (req, res) => {
    try {
        const suggestions = await Suggestion.find()
        res.render('suggestions', {
            suggestions
        }) 
    }
    catch (err) {
        next(err)
    }
}