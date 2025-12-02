import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const collectData = () => {
    console.log(name, email, password);
    fetch("http://localhost:5002/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate("/");
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="form-container">
      <form onSubmit={(e) => {e.preventDefault(); collectData();}}>
        <h2 className="text-2xl font-bold text-center text-blue-600 pb-5">
          Register
        </h2>

        <input 
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;