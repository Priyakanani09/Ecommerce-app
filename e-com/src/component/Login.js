import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { AuthContext } from "../App";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://ecommerce-app-1-igf3.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const result = await res.json();

      if (result.message === "Login successful" && result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);

        setUser(result.user);
        navigate("/", { replace: true });
      } else {
        localStorage.removeItem("user");
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setUser(null);
      alert("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <Form onSubmit={handleLogin}>
        <h2 className="text-center text-primary mb-4">Login</h2>

        {/* Email */}
        <Form.Group className="mb-4" controlId="formEmail">
          {/* <Form.Label>Email address</Form.Label> */}
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className="text-end mt-1 mb-3">
          <Link
            to="/forgot-password"
            className="text-primary no-underline font-semibold"
          >
            Forgot Password?
          </Link>
        </div>

        <Button variant="primary" type="submit" className="w-52 mx-auto d-block">
          Login
        </Button>

        <div className="text-center mt-3">
          <span>Don’t have an account? </span>
          <Link to="/signup" className="text-primary fw-bold">
            Register here
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default Login;
