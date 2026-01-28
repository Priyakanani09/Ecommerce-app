import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../App";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

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
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          setUser(data.user);
          navigate("/", { replace: true });
        } else {
          setError(data.message || "Signup failed");
        }
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
        <h2 className="text-center text-blue-600 pb-4">Register</h2>

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
        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        {error && Array.isArray(error) && (
          <ul
            style={{
              color: "red",
              paddingLeft: "15px",
              listStyleType: "disc",
              display: "block",
            }}
          >
            {error.map((msg, index) => (
              <li key={index} style={{ marginBottom: "6px" }}>
                {msg}
              </li>
            ))}
          </ul>
        )}

        <Button
          type="submit"
          className="w-36 mx-auto d-block"
          variant="primary"
        >
          Sign Up
        </Button>

        <div className="text-center mt-3">
          <span>Already registered? </span>
          <Link to="/login" className="text-primary fw-bold">
            Login here
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default Signup;
