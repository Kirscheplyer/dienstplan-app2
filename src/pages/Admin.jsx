
import { useUser, UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import DienstplanApp from "../DienstplanApp";

export default function Admin() {
  const { user } = useUser();
  const [generierterPlan, setGenerierterPlan] = useState([]);

  const generiereDienstplan = () => {
    const gespeicherteMitarbeiter = JSON.parse(localStorage.getItem("mitarbeiterListe")) || [];
    const plan = [];
    const einsatzZaehler = {};
    const letzteSchicht = {}; // { "Name": { datum: "...", schicht: "Frühschicht" } }

    const tage = 14;
    const start = new Date();

    for (let i = 0; i < tage; i++) {
      const datum = new Date();
      datum.setDate(start.getDate() + i);
      const tagName = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][datum.getDay()];
      const datumStr = datum.toISOString().split("T")[0];

      if (tagName === "So" || tagName === "Sa") continue;

      const verfuegbare = gespeicherteMitarbeiter.filter((m) => {
        if (!m.name) return false;
        const r = m.rohdaten || {};
        const istAzubi = m.rolle === "Azubi";

        if (istAzubi) {
          if (r.schultage?.includes(tagName)) return false;
          if (r.nurMoFr && (tagName === "Sa" || tagName === "So")) return false;
        }

        // Früh-/Spät nicht direkt nacheinander
        const letzter = letzteSchicht[m.name];
        if (letzter) {
          const letzterTag = new Date(letzter.datum);
          const diff = (datum - letzterTag) / (1000 * 60 * 60 * 24);
          if (
            diff === 1 &&
            ((letzter.schicht === "Spätschicht" && m.nichtNachSpaet) ||
              (letzter.schicht === "Frühschicht" && m.nichtVorFrueh))
          ) {
            return false;
          }
        }

        return true;
      });

      const zfas = verfuegbare.filter((m) => m.rolle === "ZFA");
      const azubis = verfuegbare.filter((m) => m.rolle === "Azubi");

      // Sortieren nach wer am wenigsten Einsätze hat
      const sortiert = (liste) => liste.sort((a, b) => (einsatzZaehler[a.name] || 0) - (einsatzZaehler[b.name] || 0));

      const fruehGruppe = sortiert([...zfas, ...azubis]).slice(0, 2);
      const spaetGruppe = sortiert([...zfas, ...azubis].filter(m => {
        const r = m.rohdaten || {};
        return !(r.keineSpaet && m.rolle === "Azubi");
      })).slice(0, 2);

      const tagPlan = [];

      const mindZfaFrueh = fruehGruppe.some(m => m.rolle === "ZFA");
      const mindZfaSpaet = spaetGruppe.some(m => m.rolle === "ZFA");

      if (mindZfaFrueh) {
        fruehGruppe.forEach(m => {
          tagPlan.push({ datum: datumStr, name: m.name, schicht: "Frühschicht" });
          einsatzZaehler[m.name] = (einsatzZaehler[m.name] || 0) + 1;
          letzteSchicht[m.name] = { datum: datumStr, schicht: "Frühschicht" };
        });
      }

      if (mindZfaSpaet) {
        spaetGruppe.forEach(m => {
          tagPlan.push({ datum: datumStr, name: m.name, schicht: "Spätschicht" });
          einsatzZaehler[m.name] = (einsatzZaehler[m.name] || 0) + 1;
          letzteSchicht[m.name] = { datum: datumStr, schicht: "Spätschicht" };
        });
      }

      plan.push(...tagPlan);
    }

    localStorage.setItem("dienstplan", JSON.stringify(plan));
    setGenerierterPlan(plan);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Adminbereich</h1>
      <DienstplanApp />

      <div style={{ marginTop: "2rem" }}>
        <h2>2-Wochen-Dienstplan optimiert erstellen</h2>
        <button onClick={generiereDienstplan}>⚖️ Dienstplan optimieren</button>

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
