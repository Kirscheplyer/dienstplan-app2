
import { useUser, UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import DienstplanApp from "../DienstplanApp";

const ADMIN_ID = "user_30NpYU323qGA3LO4JedrBWRQXXP";

export default function Admin() {
  const { user } = useUser();
  const [generierterPlan, setGenerierterPlan] = useState([]);

  const generiereDienstplan = () => {
    const gespeicherteMitarbeiter = JSON.parse(localStorage.getItem("mitarbeiterListe")) || [];
    console.log("Mitarbeiterliste geladen:", gespeicherteMitarbeiter);

    const tage = 14;
    const plan = [];
    const start = new Date();

    for (let i = 0; i < tage; i++) {
      const datum = new Date();
      datum.setDate(start.getDate() + i);
      const wochentag = datum.getDay();
      const tagName = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][wochentag];

      if (wochentag === 0 || wochentag === 6) continue;

      const verfuegbare = gespeicherteMitarbeiter.filter((m) => {
        if (!m.name) return false;
        const regel = m.rohdaten?.[tagName]?.toLowerCase() || "";
        return !regel.includes("nicht verfügbar");
      });

      if (verfuegbare.length === 0) continue;

      const früh = verfuegbare[0 % verfuegbare.length];
      const spät = verfuegbare[1 % verfuegbare.length] || verfuegbare[0];

      if (früh) {
        plan.push({ datum: datum.toISOString().split("T")[0], name: früh.name, schicht: "Frühschicht" });
      }
      if (spät && spät.name !== früh.name) {
        plan.push({ datum: datum.toISOString().split("T")[0], name: spät.name, schicht: "Spätschicht" });
      }
    }

    localStorage.setItem("dienstplan", JSON.stringify(plan));
    console.log("Dienstplan gespeichert:", plan);
    setGenerierterPlan(plan);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Adminbereich</h1>
      <DienstplanApp />

      <div style={{ marginTop: "2rem" }}>
        <h2>2-Wochen-Dienstplan automatisch erstellen</h2>
        <button onClick={generiereDienstplan}>🛠 Dienstplan für 1 Woche generieren</button>

        {generierterPlan.length > 0 ? (
          <div>
            <h3>✅ Vorschau:</h3>
            <ul>
              {generierterPlan.map((e, i) => (
                <li key={i}>{e.datum} – {e.name} – {e.schicht}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p style={{ color: "gray", marginTop: "1rem" }}>⚠️ Noch keine Schichten generiert.</p>
        )}
      </div>
    </div>
  );
}
