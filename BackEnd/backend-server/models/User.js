const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    favoriteRecipes: [
      {
        recipeId: {
          type: String,
          required: true, // Mark recipeId as required
        },
        recipeName: {
          type: String,
          required: true,
        },
        uniqueId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    permissions: {
      type: [String],
      default: [],
    },
  },
  { collection: "users", timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
