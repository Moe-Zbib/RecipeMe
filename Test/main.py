import sys
import os
import recipe as recipe_module


def main():
    # Get the available ingredients from the user
    available_ingredients = input(
        "Enter the ingredients you have in your fridge (separated by commas): "
    ).split(",")

    # Create an instance of the EdamamAPI class with your app ID and app key
    app_id = "a9e7f554"
    app_key = "b8e1541b40f293fc30ccc5bcad702351"
    api = recipe_module.EdamamAPI(app_id, app_key)

    # Suggest recipes based on the available ingredients
    suggested_recipes = recipe_module.suggest_recipes(available_ingredients, api)

    if suggested_recipes:
        print("Suggested recipes:")
        for recipe_name in suggested_recipes:
            print(recipe_name)
    else:
        print("No recipes found with the available ingredients.")


if __name__ == "__main__":
    main()
