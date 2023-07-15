# Sample recipe database
recipes = [
    {
        "name": "Pasta with Tomato Sauce",
        "ingredients": ["pasta", "tomato sauce", "garlic", "olive oil"],
    },
    {
        "name": "Chicken Stir-Fry",
        "ingredients": ["chicken", "vegetables", "soy sauce", "sesame oil"],
    },
    {
        "name": "Caprese Salad",
        "ingredients": ["tomato", "mozzarella cheese", "basil", "balsamic vinegar"],
    },
    # Add more recipes here...
]


def suggest_recipes(available_ingredients):
    suggested_recipes = []

    for recipe in recipes:
        # Check if any ingredient of the recipe is available
        if any(
            ingredient in available_ingredients for ingredient in recipe["ingredients"]
        ):
            suggested_recipes.append(recipe["name"])

    return suggested_recipes


# Example usage
user_ingredients = ["tomato", "mozzarella cheese", "basil", "olive oil"]
suggested_recipes = suggest_recipes(user_ingredients)

if suggested_recipes:
    print("Suggested Recipes:")
    for recipe in suggested_recipes:
        print(recipe)
else:
    print("No recipes found with the given ingredients.")
