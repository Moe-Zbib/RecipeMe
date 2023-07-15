import requests
from urllib.parse import urlencode
import re


class EdamamAPI:
    def __init__(self, app_id, app_key):
        self.base_url = "https://api.edamam.com/api/recipes/v2"
        self.app_id = app_id
        self.app_key = app_key

    def search_recipes(self, query):
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "q": query,
        }
        url = f"{self.base_url}?{urlencode(params)}"
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")
            raise ValueError("Failed to fetch recipes")


def suggest_recipes(available_ingredients, api):
    response = api.search_recipes("")  # Pass an empty query to get all recipes

    if response.status_code == 200:
        recipes = response.json()["hits"]
        suggested_recipes = []

        for hit in recipes:
            recipe = hit["recipe"]
            recipe_name = recipe["label"]
            recipe_ingredients = recipe["ingredientLines"]

            # Check if all available ingredients are present in the recipe
            if all(
                any(
                    available_ingredient.lower() in ingredient.lower()
                    for ingredient in recipe_ingredients
                )
                for available_ingredient in available_ingredients
            ):
                suggested_recipes.append(recipe_name)

        return suggested_recipes
    else:
        raise ValueError("Failed to fetch recipes")
