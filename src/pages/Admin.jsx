
import React, { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";

const gespeicherteMitarbeiter = JSON.parse(localStorage.getItem("mitarbeiterListe")) || [];

function Admin() {
  const { user } = useUser();
  const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;
  const [dienstplan, setDienstplan] = useState([]);

  const dienstplanErstellen = () => {
    const start = new Date();
    const plan = [];

    for (let i = 0; i < 14; i++) {
      const datum = new Date(start);
      datum.setDate(start.getDate() + i);

      const wochentag = datum.toLocaleDateString("de-DE", { weekday: "short" });

      gespeicherteMitarbeiter.forEach((m, idx) => {
        let schicht = "";

        if (m.rolle === "Azubi" && m.rohdaten) {
          const regel = m.rohdaten[wochentag];
          schicht = regel || "08:00 - 14:00";
        } else {
          // Einfacher Schichtplan für ZFAs
          if (["Mo", "Di", "Mi", "Do"].includes(wochentag)) {
            schicht = "13:30 - 20:30";
          } else if (wochentag === "Fr") {
            schicht = "12:30 - 18:30";
          } else {
            schicht = "Frei";
          }
        }

        plan.push({
          datum: datum.toLocaleDateString("de-DE"),
          name: m.name,
          schicht,
        });
      });
    }

    localStorage.setItem("dienstplan", JSON.stringify(plan));
    setDienstplan(plan);
  };

  useEffect(() => {
    const gespeichert = localStorage.getItem("dienstplan");
    if (gespeichert) setDienstplan(JSON.parse(gespeichert));
  }, []);

  if (user?.id !== ADMIN_ID) {
    return <div>Kein Zugriff.</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Admin-Bereich</h1>

      <section>
        <h2>2-Wochen-Dienstplan erstellen</h2>
        <button onClick={dienstplanErstellen}>Dienstplan generieren</button>

        {dienstplan.length === 0 ? (
          <p>Noch keine Schichten generiert.</p>
        ) : (
          <table border="1" cellPadding="5" style={{ marginTop: "1rem", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Name</th>
                <th>Schicht</th>
              </tr>
            </thead>
            <tbody>
              {dienstplan.map((eintrag, i) => (
                <tr key={i}>
                  <td>{eintrag.datum}</td>
                  <td>{eintrag.name}</td>
                  <td>{eintrag.schicht}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Admin;
