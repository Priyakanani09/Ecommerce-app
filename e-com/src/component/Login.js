import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { AuthContext } from "../App";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ================= REDIRECT IF ALREADY LOGGED IN ================= */
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  /* ================= LOGIN FUNCTION ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://ecommerce-app-1-igf3.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await res.json();

      if (result.message === "Login successful" && result.user) {
        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);

        // Update context
        setUser(result.user);

        // Redirect to home
        navigate("/", { replace: true });
      } else {
        localStorage.removeItem("user");
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setUser(null);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Form onSubmit={handleLogin}>
        <h2 className="text-center text-primary mb-4">Login</h2>

        {/* Email */}
        <Form.Group className="mb-4" controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-3 position-relative">
          <Form.Control
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: "15px",
              top: "15px",
              cursor: "pointer",
            }}
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </Form.Group>

        {/* Forgot Password */}
        <div className="text-end mt-1 mb-3">
          <Link
            to="/forgot-password"
            className="text-primary no-underline font-semibold"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Button */}
        <Button
          variant="primary"
          type="submit"
          className="w-52 mx-auto d-block"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* Register */}
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