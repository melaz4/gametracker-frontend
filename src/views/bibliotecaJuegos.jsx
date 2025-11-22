import React, { useState, useEffect } from "react";
import TarjetaJuego from "../components/tarjetaJuego";
import ModalResenas from "../components/modalResenas";

export default function BibliotecaJuegos() {
    const [games, setGames] = useState([]);
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        genero: "",
        desarrollador: "",
        imagen: "",
    });
    const [editId, setEditId] = useState(null);
    const [activeTab, setActiveTab] = useState("biblioteca");
    const [busqueda, setBusqueda] = useState("");

    const [mostrarResenas, setMostrarResenas] = useState(false);
    const [juegoActivo, setJuegoActivo] = useState(null);

    const token = localStorage.getItem("token");

    // Cargar juegos al inicio
    useEffect(() => {
    fetch("http://localhost:5000/api/juegos", {
        headers: { Authorization: "Bearer " + token }
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("RESPUESTA DEL BACKEND:", data);

            // Si es un array, lo usamos directo
            if (Array.isArray(data)) {
                setGames(data);
            }

            // Si viene dentro de un objeto: { juegos: [...] }
            else if (Array.isArray(data.juegos)) {
                setGames(data.juegos);
            }

            else {
                console.warn("Formato inesperado en la API");
                setGames([]);
            }
        })
        .catch((err) =>
            console.error("Error cargando juegos:", err)
        );
}, []);

    function abrirResenas(id) {
        const juego = games.find((j) => j._id === id);
        setJuegoActivo(juego);
        setMostrarResenas(true);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    }

    function cargarJuegoParaEditar(juego) {
        setEditId(juego._id);
        setForm({
            nombre: juego.nombre || "",
            descripcion: juego.descripcion || "",
            genero: Array.isArray(juego.genero) ? juego.genero.join(", ") : (juego.genero || ""),
            desarrollador: juego.desarrollador || "",
            imagen: juego.imagen || "",
        });
        setActiveTab("add");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const generoArray = form.genero
            .split(",")
            .map((g) => g.trim())
            .filter((g) => g.length > 0);

        const payload = { ...form, genero: generoArray };

        try {
            let response;

            if (editId) {
                // EDITAR
                response = await fetch(
                    `http://localhost:5000/api/juegos/${editId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                        body: JSON.stringify(payload),
                    }
                );

                const actualizado = await response.json();

                setGames((prev) =>
                    prev.map((j) => (j._id === editId ? actualizado : j))
                );

                setEditId(null);
            } else {
                // CREAR NUEVO
                response = await fetch("http://localhost:5000/api/juegos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify(payload),
                });

                const creado = await response.json();
                setGames((prev) => [creado, ...prev]);
            }

            // limpiar formulario
            setForm({
                nombre: "",
                descripcion: "",
                genero: "",
                desarrollador: "",
                imagen: "",
            });

            setActiveTab("biblioteca");
        } catch (error) {
            console.error(error);
            alert("Error guardando el juego");
        }
    }

    async function eliminarJuego(id) {
        const confirmar = window.confirm("¿Seguro que deseas eliminar este juego?");
        if (!confirmar) return;

        try {
            const resp = await fetch(`http://localhost:5000/api/juegos/${id}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token }
            });

            if (!resp.ok) throw new Error("Error al eliminar");

            setGames((prev) => prev.filter((j) => j._id !== id));
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el juego");
        }
    }

    // FILTRO SOLO PARA "Buscar"
    const juegosFiltrados = games.filter((g) => {
        const nombre = (g.nombre ?? "").toLowerCase();
        const texto = (busqueda ?? "").toLowerCase();
        return nombre.includes(texto);
    });

    return (
        <section style={{ marginTop: "20px" }}>
            <div className="tabs-bar">
                <button
                    className={`tab-btn ${activeTab === "biblioteca" ? "active" : ""}`}
                    onClick={() => setActiveTab("biblioteca")}
                >
                    Biblioteca
                </button>

                <button
                    className={`tab-btn ${activeTab === "buscar" ? "active" : ""}`}
                    onClick={() => setActiveTab("buscar")}
                >
                    Buscar
                </button>

                <button
                    className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
                    onClick={() => {
                        setForm({
                            nombre: "",
                            descripcion: "",
                            genero: "",
                            desarrollador: "",
                            imagen: "",
                        });
                        setEditId(null);
                        setActiveTab("add");
                    }}
                >
                    Añadir juego
                </button>
            </div>

            {/* === BUSCAR === */}
            {activeTab === "buscar" && (
                <>
                    <div className="filtros-bar">
                        <input
                            className="input-busqueda"
                            placeholder="Buscar un juego..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    <div className="games-grid">
                        {juegosFiltrados.length === 0 ? (
                            <p>No se encontraron juegos.</p>
                        ) : (
                            juegosFiltrados.map((g) => (
                                <TarjetaJuego
                                    key={g._id}
                                    {...g}
                                    onDelete={eliminarJuego}
                                    onEdit={() => cargarJuegoParaEditar(g)}
                                    onOpenResenas={() => abrirResenas(g._id)}
                                />
                            ))
                        )}
                    </div>
                </>
            )}

            {/* === BIBLIOTECA (SIN FILTRO) === */}
            {activeTab === "biblioteca" && (
                <div className="games-grid">
                    {games.map((g) => (
                        <TarjetaJuego
                            key={g._id}
                            {...g}
                            onDelete={eliminarJuego}
                            onEdit={() => cargarJuegoParaEditar(g)}
                            onOpenResenas={() => abrirResenas(g._id)}
                        />
                    ))}
                </div>
            )}

            {/* === AÑADIR / EDITAR === */}
            {activeTab === "add" && (
                <div className="game-form-container">
                    <h2 className="game-form-title">
                        {editId ? "Editar juego" : "Añadir juego"}
                    </h2>

                    <form className="game-form" onSubmit={handleSubmit}>
                        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
                        <input name="desarrollador" placeholder="Desarrollador" value={form.desarrollador} onChange={handleChange} />
                        <input name="genero" placeholder="Géneros (separados por comas)" value={form.genero} onChange={handleChange} />
                        <input name="imagen" placeholder="URL imagen" value={form.imagen} onChange={handleChange} />
                        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />

                        <button type="submit">{editId ? "Guardar cambios" : "Añadir juego"}</button>
                    </form>
                </div>
            )}

            {mostrarResenas && juegoActivo && (
                <ModalResenas
                    juegoId={juegoActivo._id}
                    onClose={() => setMostrarResenas(false)}
                />
            )}
        </section>
    );
}
