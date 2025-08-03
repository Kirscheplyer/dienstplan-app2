
import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const schichtzeiten = {
  moDo: {
    Frühschicht: "07:30 - 14:30",
    Spätschicht: "13:30 - 20:30",
  },
  fr: {
    Frühschicht: "07:30 - 13:30",
    Spätschicht: "12:30 - 18:30",
  },
};

export default function Dashboard() {
  const [dienstplan, setDienstplan] = useState([]);
  const [gefiltertNach, setGefiltertNach] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("dienstplan");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed[0]?.datum && parsed[0]?.name && parsed[0]?.schicht) {
          setDienstplan(parsed);
        } else {
          setDienstplan([]);
        }
      } catch {
        setDienstplan([]);
      }
    }
  }, []);

  const mitarbeitende = Array.from(new Set(dienstplan.map((e) => e.name)));

  const sichtbarerPlan = gefiltertNach
    ? dienstplan.filter((e) => e.name === gefiltertNach)
    : dienstplan;

  const getUhrzeit = (datum, schicht) => {
    const day = new Date(datum).getDay();
    if (day === 5) return schichtzeiten.fr[schicht] || "";
    return schichtzeiten.moDo[schicht] || "";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Willkommen im Dienstplan</h1>
      <p>Hier kannst du dir den Plan für dich oder Kolleg*innen anzeigen lassen.</p>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Filter nach Mitarbeiter:</strong><br />
        <button onClick={() => setGefiltertNach("")}>Alle</button>{" "}
        {mitarbeitende.map((name) => (
          <button key={name} onClick={() => setGefiltertNach(name)} style={{ margin: "0.2rem" }}>
            {name}
          </button>
        ))}
      </div>

      <section>
        <h2>{gefiltertNach ? `Dienstplan für ${gefiltertNach}` : "Gesamter Dienstplan"}</h2>
        {sichtbarerPlan.length === 0 ? (
          <p>Keine Schichten vorhanden.</p>
        ) : (
          <table border="1" cellPadding="5" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Name</th>
                <th>Schicht</th>
              </tr>
            </thead>
            <tbody>
              {sichtbarerPlan.map((eintrag, index) => (
                <tr key={index}>
                  <td>{eintrag.datum}</td>
                  <td>{eintrag.name}</td>
                  <td>
                    {eintrag.schicht} ({getUhrzeit(eintrag.datum, eintrag.schicht)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
