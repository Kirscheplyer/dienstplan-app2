
import React, { useEffect, useState } from "react";

export default function Wochenansicht() {
  const [dienstplan, setDienstplan] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("dienstplan");
    if (data) {
      setDienstplan(JSON.parse(data));
    }
  }, []);

  const gruppiertNachTag = dienstplan.reduce((acc, eintrag) => {
    if (!acc[eintrag.datum]) acc[eintrag.datum] = [];
    acc[eintrag.datum].push(eintrag);
    return acc;
  }, {});

  const sortierteTage = Object.keys(gruppiertNachTag).sort();

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Visuelle Wochenansicht</h2>
      {sortierteTage.length === 0 ? (
        <p>Noch kein Dienstplan erstellt.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", marginTop: "1rem", width: "100%" }}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Mitarbeiter</th>
              <th>Schicht</th>
            </tr>
          </thead>
          <tbody>
            {sortierteTage.map((datum) =>
              gruppiertNachTag[datum].map((eintrag, i) => (
                <tr key={datum + i}>
                  <td>{datum}</td>
                  <td>{eintrag.name}</td>
                  <td>{eintrag.schicht}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
