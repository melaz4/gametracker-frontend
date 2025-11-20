import React, { useState, useEffect } from 'react'
import TarjetaJuego from '../components/tarjetaJuego'



export default function BibliotecaJuegos() {
	const [games, setGames] = useState([])
	const [form, setForm] = useState({ nombre: '', descripcion: '', genero: '', desarrollador: '', imagen: '' })

	useEffect(() => {
	fetch("http://localhost:5000/api/juegos")
		.then(res => res.json())
		.then(data => setGames(data))
		.catch(err => console.error("Error cargando juegos:", err));
	}, []);


	function handleChange(e) {
		const { name, value } = e.target
		setForm((s) => ({ ...s, [name]: value }))
	}

	async function handleSubmit(e) {
		e.preventDefault();

		if (!form.nombre.trim()) return alert('El nombre es obligatorio');

		try {
			const response = await fetch("http://localhost:5000/api/juegos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form)
			});

			if (!response.ok) throw new Error("Error al guardar");

			const juegoCreado = await response.json();

			setGames((prev) => [juegoCreado, ...prev]);

			setForm({ nombre: '', descripcion: '', genero: '', desarrollador: '', imagen: '' });

		} catch (error) {
			console.error("Error guardando juego:", error);
			alert("No se pudo guardar el juego");
		}
	}

	async function eliminarJuego(id) {

		const confirmar = window.confirm("¿Seguro que deseas eliminar este juego?");
		if (!confirmar) return;

		try {
			const resp = await fetch(`http://localhost:5000/api/juegos/${id}`, {
			method: "DELETE"
			});

			if (!resp.ok) throw new Error("Error al eliminar");

			setGames(prev => prev.filter(j => (j._id || j.id) !== id));
		} 
		catch (error) {
			console.error("Error eliminando:", error);
			alert("No se pudo eliminar el juego");
		}}

	return (
		<section>
			<h2>Biblioteca de Juegos</h2>

			<form className="game-form" onSubmit={handleSubmit} style={{ marginBottom: 18 }}>

				<div className="row">
					<input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
				</div>

				<div>
					<input name="desarrollador" placeholder="Desarrollador" value={form.desarrollador} onChange={handleChange} />
				</div>

				<div className="row">
					<input name="genero" placeholder="Género" value={form.genero} onChange={handleChange} />
				</div>

				<div>
					<input name="imagen" placeholder="URL de imagen (opcional)" value={form.imagen} onChange={handleChange} />
				</div>
				
				<div className="row">
					<textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
				</div>
				<div>
					<button type="submit">Añadir juego</button>
				</div>
			</form>

			{games.length === 0 ? (
				<p>No hay juegos todavía. Usa el formulario para añadir uno.</p>
			) : (
				<div className="games-grid">
					{games.map((g) => (
						<TarjetaJuego
							key={g._id || g.id}     // key para React
							_id={g._id || g.id}     // prop que el componente espera
							nombre={g.nombre}
							descripcion={g.descripcion}
							genero={g.genero}
							desarrollador={g.desarrollador}
							imagen={g.imagen}
							onDelete={eliminarJuego} // función definida en este componente
						/>
						))}
				</div>
				)}
		</section>
	)
}


