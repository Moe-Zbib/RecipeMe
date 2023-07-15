const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cors = require("cors");
const Recipe = require("./models/Recipe");

const app = express();
const port = 8000;
const uri =
  "mongodb+srv://MoeZbib:Zahraa123@recipeme.tc0yrej.mongodb.net/RecipeMe?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());
app.use(cors());

// Secret key for JWT
const JWT_SECRET = "your-secret-key";
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    console.log("Token valid");
    return decoded; // Return the decoded token payload
  } catch (error) {
    console.error("Failed to verify token:", error.message);
    return null; // Return null if token verification fails
  }
};

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  try {
    const decoded = verifyToken(token); // Verify and decode the token

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has the necessary permissions

    // Set the user object in the request for further processing
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

app.post("/searchRecipes", async (req, res) => {
  const { query } = req.body;

  try {
    // Find recipes in the database that match the query
    const recipes = await Recipe.find({
      name: { $regex: query, $options: "i" }, // Match recipe name (case-insensitive)
    });

    console.log("Search successful. Found recipes:", recipes);

    res.status(200).json(recipes); // Send the recipes directly without wrapping in an object
  } catch (error) {
    console.error("Failed to search recipes:", error.message);
    res.status(500).json({ error: "Internal server error" }); // Use "error" instead of "message" key in the error response
  }
});

app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a session token
    const sessionToken = generateSessionToken(newUser);

    res.status(201).json({ message: "Registration successful", sessionToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a session token
    const sessionToken = generateSessionToken(user);

    res.json({ message: "Login successful", sessionToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/", (req, res) => {
  res.send("Welcome to the RecipeMe API");
});

app.get("/getFavoriteRecipes", authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    const likedRecipes = user.favoriteRecipes || [];
    res.status(200).json({ likedRecipes });
  } catch (error) {
    console.error("Failed to fetch liked recipes:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete(
  "/removeFavoriteRecipe/:recipeId",
  authenticateUser,
  async (req, res) => {
    try {
      const { recipeId } = req.params;
      const user = req.user;
      user.favoriteRecipes = user.favoriteRecipes.filter(
        (recipe) => recipe.recipeId !== recipeId
      );
      await user.save();
      res
        .status(200)
        .json({ message: "Recipe removed from favorites successfully" });
    } catch (error) {
      console.error("Failed to remove recipe from favorites:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post("/addFavoriteRecipe", authenticateUser, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = req.user;
    user.favoriteRecipes.push({ recipeId });
    await user.save();
    res.status(200).json({ message: "Recipe added to favorites successfully" });
  } catch (error) {
    console.error("Failed to add recipe to favorites:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/", (req, res) => {
  res.send("Welcome to the RecipeMe API");
});

app.get("/getFavoriteRecipes", authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    const likedRecipes = user.favoriteRecipes || [];
    res.status(200).json({ likedRecipes });
  } catch (error) {
    console.error("Failed to fetch liked recipes:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete(
  "/removeFavoriteRecipe/:recipeId",
  authenticateUser,
  async (req, res) => {
    try {
      const { recipeId } = req.params;
      const user = req.user;
      user.favoriteRecipes = user.favoriteRecipes.filter(
        (recipe) => recipe.recipeId !== recipeId
      );
      await user.save();
      res
        .status(200)
        .json({ message: "Recipe removed from favorites successfully" });
    } catch (error) {
      console.error("Failed to remove recipe from favorites:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post("/addFavoriteRecipe", authenticateUser, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = req.user;
    user.favoriteRecipes.push({ recipeId });
    await user.save();
    res.status(200).json({ message: "Recipe added to favorites successfully" });
  } catch (error) {
    console.error("Failed to add recipe to favorites:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Generate a session token
const generateSessionToken = (user) => {
  // Create a JWT token with user ID and secret key
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  return token;
};

// ...

const handleSuccessfulAuth = (user) => {
  const sessionToken = generateSessionToken(user);
  console.log("Session token:", sessionToken); // Log the session token
  return sessionToken;
};

app.post("/register", async (req, res) => {
  // ...

  try {
    // ...

    // Save the new user to the database
    await newUser.save();

    // Generate a session token
    const sessionToken = handleSuccessfulAuth(newUser);

    res.status(201).json({ message: "Registration successful", sessionToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  // ...

  try {
    // ...

    // Generate a session token
    const sessionToken = handleSuccessfulAuth(user);

    res.json({ message: "Login successful", sessionToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ...
