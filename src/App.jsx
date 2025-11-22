import React, { useState } from "react";
import Login from "./auth/login";
import Register from "./auth/register";
import BibliotecaJuegos from "./views/BibliotecaJuegos";

export default function App() {
    const [vista, setVista] = useState(
        localStorage.getItem("token") ? "app" : "login"
    );

    function cerrarSesion() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setVista("login");
    }

    return (
        <div className="app-root">

            {vista === "login" && (
                <Login cambiarVista={setVista} onLogin={() => setVista("app")} />
            )}

            {vista === "register" && (
                <Register cambiarVista={setVista} />
            )}

            {vista === "app" && (
                <>
                    <nav className="navbar">
                        <div className="navbar-left">
                            <h2 className="logo">GameTracker</h2>
                        </div>

                        <div className="navbar-right">
                            <button
                                className="nav-btn nav-danger"
                                onClick={cerrarSesion}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </nav>

                    <main style={{ padding: "20px" }}>
                        <BibliotecaJuegos />
                    </main>
                </>
            )}
        </div>
    );
}
