import React, { useState } from "react";

export default function Login({ cambiarVista, onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const resp = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass })
      });

      const data = await resp.json();

      if (!resp.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", data.usuario);

      onLogin();
    } catch (err) {
      alert("Error al iniciar sesión");
      console.error(err);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Contraseña"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <button type="submit">Entrar</button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta?{" "}
          <button onClick={() => cambiarVista("register")}>
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}
