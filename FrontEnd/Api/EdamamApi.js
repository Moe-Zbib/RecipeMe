import axios from "axios";
import apiConfig from "./EdamamApiConfig";

const EdamamAPI = {
  searchRecipes: async (query) => {
    try {
      const response = await axios.get(apiConfig.baseURL, {
        params: {
          app_id: apiConfig.appID,
          app_key: apiConfig.appKey,
          q: query,
        },
      });

      const data = response.data;
      if (data && data.hits) {
        return data.hits.map((hit) => hit.recipe);
      } else {
        throw new Error("Invalid response from the API");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch recipes");
    }
  },

  getRecommendedRecipes: async (count) => {
    try {
      const response = await axios.get(apiConfig.baseURL, {
        params: {
          app_id: apiConfig.appID,
          app_key: apiConfig.appKey,
          q: "recommended",
          from: 0,
          to: count - 1,
        },
      });

      const data = response.data;
      if (data && data.hits) {
        return data.hits.map((hit) => hit.recipe);
      } else {
        throw new Error("Invalid response from the API");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch recommended recipes");
    }
  },
};

export default EdamamAPI;
