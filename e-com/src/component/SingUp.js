import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const collectData = () => {
    if (password !== confirmPassword) {
      setError("Password don't match");
      return;
    }

    setError("");

    fetch("https://ecommerce-app-1-igf3.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="form-container">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          collectData();
        }}
      >
        <h2 className="text-center text-blue-600 pb-4">
          Register
        </h2>

        {/* Username */}
        <Form.Group className="mb-4" controlId="formUsername">
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-4" controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-4" controlId="formPassword">
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group className="mb-4" controlId="formConfirmPassword">
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button type="submit" className="w-36 mx-auto d-block" variant="primary">
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

export default Signup;
