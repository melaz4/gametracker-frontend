import React, { useState } from "react";

export default function Register({ cambiarVista }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const resp = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!resp.ok) throw new Error("Error en registro");

      alert("Registrado correctamente");
      cambiarVista("login");
    } catch (err) {
      console.error(err);
      alert("No se pudo registrar");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
          <input name="email" placeholder="Correo" value={form.email} onChange={handleChange} />
          <input name="password" placeholder="Contraseña" type="password" value={form.password} onChange={handleChange} />

          <button type="submit">Registrarse</button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta?{" "}
          <button onClick={() => cambiarVista("login")}>
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}
