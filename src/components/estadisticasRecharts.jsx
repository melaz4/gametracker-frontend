import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function EstadisticasRecharts() {
  const [stats, setStats] = useState(null);
  const [dist, setDist] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function cargar() {
      try {
        // estadisticas generales
        const res = await fetch("http://localhost:5000/api/estadisticas", {
          headers: { "Authorization": "Bearer " + token }
        });
        const s = await res.json();
        setStats(s);

        // distribution: pedir reseñas y calcular conteo por puntuacion
        const r = await fetch("http://localhost:5000/api/resenas", {
          headers: { "Authorization": "Bearer " + token }
        });
        const all = await r.json();
        const counts = [0,0,0,0,0];
        if (Array.isArray(all)) {
          for (const it of all) {
            const p = Math.round(it.puntuacion);
            if (p >=1 && p <=5) counts[p-1]++;
          }
        }
        const data = counts.map((c, idx) => ({ name: `${idx+1}★`, value: c }));
        setDist(data);
      } catch (err) {
        console.error(err);
      }
    }
    cargar();
  }, []);

  if (!stats) return <p>Cargando estadísticas...</p>;

  const COLORS = ["#f44336","#ff9800","#ffd54f","#ffeb3b","#8bc34a"];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, alignItems:"start" }}>
      <div style={{ background:"rgba(255,255,255,0.02)", padding:12, borderRadius:8 }}>
        <h3>Resumen</h3>
        <div style={{ display:"flex", gap:12 }}>
          <div>
            <strong>Total juegos</strong><div>{stats.total}</div>
          </div>
          <div>
            <strong>Completados</strong><div>{stats.completados}</div>
          </div>
          <div>
            <strong>Horas jugadas</strong><div>{stats.totalHoras}</div>
          </div>
          <div>
            <strong>Promedio</strong><div>{stats.promedioPuntuacion}</div>
          </div>
        </div>
      </div>

      <div style={{ background:"rgba(255,255,255,0.02)", padding:12, borderRadius:8 }}>
        <h3>Distribución de puntuaciones</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dist} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value">
              {dist.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ gridColumn: "1 / -1", background:"rgba(255,255,255,0.02)", padding:12, borderRadius:8 }}>
        <h3>Porcentaje de puntuaciones</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={dist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {dist.map((entry, index) => (
                <Cell key={`cellpie-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
