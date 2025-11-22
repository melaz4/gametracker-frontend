import React, { useState } from "react";

export default function Filtros({ onApply }) {
  const [genero, setGenero] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [completado, setCompletado] = useState("");

  function aplicar() {
    onApply({ genero, plataforma, completado });
  }

  return (
    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
      <input placeholder="Género" value={genero} onChange={e=>setGenero(e.target.value)} />
      <input placeholder="Plataforma" value={plataforma} onChange={e=>setPlataforma(e.target.value)} />
      <select value={completado} onChange={e=>setCompletado(e.target.value)}>
        <option value="">Todos</option>
        <option value="true">Completados</option>
        <option value="false">No completados</option>
      </select>
      <button onClick={aplicar}>Filtrar</button>
    </div>
  );
}
