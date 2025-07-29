
import React, { useEffect, useState } from "react";

function parseSchichtzeit(text) {
  const match = text.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
  if (!match) return 0;

  const [_, start, ende] = match;
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = ende.split(":").map(Number);

  let startMin = h1 * 60 + m1;
  let endMin = h2 * 60 + m2;

  if (endMin < startMin) endMin += 24 * 60; // Nachtwechsel?
  return (endMin - startMin) / 60;
}

export default function StundenRechner() {
  const [summen, setSummen] = useState({});

  useEffect(() => {
    const data = localStorage.getItem("dienstplan");
    if (!data) return;

    const plan = JSON.parse(data);
    const summenTemp = {};

    plan.forEach(({ name, schicht }) => {
      const stunden = parseSchichtzeit(schicht);
      if (!summenTemp[name]) {
        summenTemp[name] = { stunden: 0, einsaetze: 0 };
      }
      summenTemp[name].stunden += stunden;
      summenTemp[name].einsaetze += 1;
    });

    setSummen(summenTemp);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Arbeitsstunden pro Mitarbeiter (2 Wochen)</h2>
      {Object.keys(summen).length === 0 ? (
        <p>Noch kein Dienstplan vorhanden.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Mitarbeiter</th>
              <th>Stunden</th>
              <th>Einsätze</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summen).map(([name, daten]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{daten.stunden.toFixed(1)} Std</td>
                <td>{daten.einsaetze}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
