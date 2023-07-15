import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import api from "../../Api/Backend";

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleSuccessfulAuth = async (sessionToken) => {
    console.log("Session token:", sessionToken); // Log the session token
    await AsyncStorage.setItem("sessionToken", sessionToken);
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  const handleAuth = async () => {
    if (isSigningUp) {
      // Sign up logic
      if (!validateEmail(email)) {
        setError("Invalid email format");
        return;
      }
      const passwordValidationResult = validatePassword(password);
      if (!passwordValidationResult.valid) {
        setError(passwordValidationResult.error);
        return;
      }

      try {
        const response = await api.post("/register", {
          email,
          username,
          password,
        });
        console.log("Registration successful");
        const sessionToken = response.data?.sessionToken;
        if (sessionToken) {
          handleSuccessfulAuth(sessionToken);
        }
      } catch (error) {
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("Registration failed");
        }
      }
    } else {
      // Login logic
      try {
        const response = await api.post("/login", {
          email,
          password,
        });
        console.log("Login successful");
        const sessionToken = response.data?.sessionToken;
        if (sessionToken) {
          handleSuccessfulAuth(sessionToken);
        }
      } catch (error) {
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("Login failed");
        }
      }
    }
  };

  const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmedEmail);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)[a-zA-Z0-9]{6,}$/;
    if (password.length < 6) {
      return {
        valid: false,
        error: "Password should be at least 6 characters long",
      };
    }
    if (!passwordRegex.test(password)) {
      return {
        valid: false,
        error:
          "Password should only contain letters and numbers, and must include at least one number",
      };
    }
    return { valid: true };
  };

  const toggleAuthMode = () => {
    setIsSigningUp((prevMode) => !prevMode);
    setEmail("");
    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication</Text>

      {isSigningUp && (
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isSigningUp ? "Sign Up" : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleAuthMode}>
        <Text style={styles.toggleText}>
          {isSigningUp
            ? "Already have an account? Login!"
            : "Don't have an account? Sign Up!"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F4F4F4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#E9E9E9",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#1a2626",
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  toggleText: {
    marginTop: 10,
    color: "#F16D35",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default AuthScreen;
