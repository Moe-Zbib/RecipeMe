def get_available_ingredients():
    available_ingredients = input(
        "Enter the ingredients you have in your fridge (separated by commas): "
    ).split(",")
    return available_ingredients
