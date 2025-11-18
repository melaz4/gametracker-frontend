import React from 'react'
import BibliotecaJuegos from './views/bibliotecaJuegos'

function App() {
	return (
		<div className="app-root" >
			<header >
				<h1 >Game Tracker</h1>
				<p >Gestiona y consulta tu biblioteca de juegos</p>
			</header>
			<main>
				<BibliotecaJuegos />
			</main>
		</div>
	)
}

export default App

