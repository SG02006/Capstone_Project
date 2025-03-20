import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  // Generate a unique numeric ID based on the current timestamp
  const generateUniqueId = () => {
    return Date.now(); // Returns a unique number based on the current timestamp
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    // Create a user object with a generated numeric ID
    const newUser = {
      id: generateUniqueId(), // Add the unique ID here
      name,
      email,
      password,
      role: "employee",
    };

    // Make the POST request with the new user data
    axios
      .post("http://localhost:3000/users", newUser)
      .then(() => {
        history.push("/login");
      })
      .catch((error) => {
        console.error("Error signing up:", error);
      });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;