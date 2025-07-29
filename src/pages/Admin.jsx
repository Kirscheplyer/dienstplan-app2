
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

    const getCalendarWeek = (date) => {
      const target = new Date(date.valueOf());
      const dayNr = (date.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      const firstThursday = new Date(target.getFullYear(), 0, 4);
      const diff = target - firstThursday;
      return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
    };

    const aktuelleWoche = getCalendarWeek(start);
    const zfaFruehschicht = aktuelleWoche % 2 === 1; // ungerade = Früh, gerade = Spät

    for (let i = 0; i < 14; i++) {
      const datum = new Date(start);
      datum.setDate(start.getDate() + i);

      const wochentag = datum.toLocaleDateString("de-DE", { weekday: "short" });

      gespeicherteMitarbeiter.forEach((m, idx) => {
        let schicht = "";

        if (m.rolle === "Azubi" && m.rohdaten) {
          const regel = m.rohdaten[wochentag];
          schicht = regel || "07:30 - 14:30";
        } else {
          if (["Mo", "Di", "Mi", "Do"].includes(wochentag)) {
            schicht = zfaFruehschicht ? "07:30 - 14:30" : "13:30 - 20:30";
          } else if (wochentag === "Fr") {
            schicht = zfaFruehschicht ? "07:30 - 13:30" : "12:30 - 18:30";
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

  if (user?.primaryEmailAddress?.emailAddress !== import.meta.env.VITE_ADMIN_EMAIL) {
    return <div>Kein Zugriff.</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Admin-Bereich</h1><p>Deine aktuelle E-Mail: {user?.primaryEmailAddress?.emailAddress}</p>

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
