const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: false,
    },
  },
  { collection: "recipes" } // Specify the collection name
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
