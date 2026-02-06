import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://ecommerce-app-1-igf3.onrender.com/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        navigate("/login"); 
      } else {
        alert(
          Array.isArray(result.message)
            ? result.message.join("\n")
            : result.message
        );
      }
    } catch (error) {
      alert("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Form onSubmit={handleForgotPassword}>
        <h2 className="text-center text-primary mb-4">Forgot Password</h2>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {/* New Password */}
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-52 mx-auto d-block "
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        <div className="text-center mt-3">
          <Link to="/login" className="text-primary no-underline fw-bold">
            Back to Login
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default ForgotPassword;