const axios = require("axios");
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe");

mongoose
  .connect(
    "mongodb+srv://MoeZbib:Zahraa123@recipeme.tc0yrej.mongodb.net/RecipeMe?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    let completed = false;

    axios
      .get(
        "https://api.edamam.com/api/recipes/v2?type=public&random=true&q=soup&app_id=a9e7f554&app_key=b8e1541b40f293fc30ccc5bcad702351&to=500"
      )
      .then(async (response) => {
        const recipes = response.data.hits;

        const savePromises = recipes.map(async (recipe) => {
          const { label, image, source, ingredients, uri } = recipe.recipe;

          const ingredientNames = ingredients.map(
            (ingredient) => ingredient.text
          );

          // Extract the category of the recipe if it exists, otherwise set it to null
          const category = "soup";

          const newRecipe = new Recipe({
            name: label,
            image: image, // Assign the image link directly to the image field
            source,
            ingredients: ingredientNames,
            uniqueId: uri,
            category, // Add the category to the recipe document
          });

          try {
            // Save the recipe to the database
            await newRecipe.save();
          } catch (error) {
            console.error(`Failed to save recipe ${label}:`, error.message);
          }

          return newRecipe;
        });

        const savedRecipes = await Promise.all(savePromises);
        completed = true;
        console.log("Recipes saved successfully");

        // Display the image links in the console
        savedRecipes.forEach((recipe) => {
          console.log(`Recipe: ${recipe.name}`);
          console.log(`Image Link: ${recipe.image}`);
          console.log("------------------------");
        });
      })
      .catch((error) => {
        console.error(
          "Failed to fetch recipes from the Edamam API:",
          error.message
        );
      })
      .finally(() => {
        mongoose.connection.close();
        console.log("MongoDB connection closed");
        console.log(`Process completed: ${completed}`);
      });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });
