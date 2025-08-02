
import React, { useEffect, useState } from "react";
import "./style.css";

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d - jan1) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + jan1.getDay() + 1) / 7);
  return `KW${week}-${d.getFullYear()}`;
}

function isEvenWeek(dateStr) {
  const d = new Date(dateStr);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d - jan1) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + jan1.getDay() + 1) / 7);
  return week % 2 === 0;
}

export default function DienstplanApp() {
  const [mitarbeiter, setMitarbeiter] = useState([]);
  const [dienstplan, setDienstplan] = useState({});
  const [startDatum, setStartDatum] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() - now.getDay() + 1);
    return now.toISOString().substring(0, 10);
  });

  const tage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
  const schichten = ["Früh", "Spät"];

  const weekKey = getWeekKey(startDatum);
  const evenWeek = isEvenWeek(startDatum);

  useEffect(() => {
    const gespeicherte = JSON.parse(localStorage.getItem("mitarbeiterListe")) || [];
    setMitarbeiter(gespeicherte);

    const plan = JSON.parse(localStorage.getItem("dienstplanAuto")) || {};
    setDienstplan(plan);
  }, []);

  useEffect(() => {
    localStorage.setItem("dienstplanAuto", JSON.stringify(dienstplan));
  }, [dienstplan]);

  const autoGeneratePlan = () => {
    const neueWoche = {};

    const zfas = mitarbeiter.filter(m => m.rolle === "ZFA");
    const azubis = mitarbeiter.filter(m => m.rolle === "Azubi");

    tage.forEach((tag, tIndex) => {
      neueWoche[tag] = {};

      ["Früh", "Spät"].forEach((schicht) => {
        const assigned = [];

        // ZFA im Wechsel zuweisen
        const zfaIndex = (evenWeek ? 0 : 1) + tIndex % zfas.length;
        const zfa = zfas[zfaIndex % zfas.length];
        if (zfa) assigned.push(zfa.name);

        // Azubi prüfen
        azubis.forEach((azubi) => {
          const regel = azubi.regeln?.[tag];
          if (!regel || regel.toLowerCase().includes("ab") || regel === "") {
            if (regel?.toLowerCase().includes("ab")) {
              const uhrzeit = parseInt(regel.split("ab")[1]);
              if (schicht === "Spät") {
                assigned.push(azubi.name);
              }
            } else {
              assigned.push(azubi.name);
            }
          }
        });

        neueWoche[tag][schicht] = assigned;
      });
    });

    setDienstplan((prev) => ({
      ...prev,
      [weekKey]: neueWoche
    }));
  };

  const removePerson = (tag, schicht, name) => {
    setDienstplan((prev) => {
      const copy = { ...prev };
      copy[weekKey][tag][schicht] = copy[weekKey][tag][schicht].filter((n) => n !== name);
      return copy;
    });
  };

  return (
    <div>
      <h2>Dienstplan – Automatisch & Manuell</h2>

      <label>
        Woche ab (Montag):
        <input
          type="date"
          value={startDatum}
          onChange={(e) => setStartDatum(e.target.value)}
        />
      </label>
      <button onClick={autoGeneratePlan} style={{ marginLeft: "1rem" }}>
        Dienstplan automatisch erstellen
      </button>

      <div style={{ marginTop: "2rem" }}>
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              {schichten.map((s) => (
                <th key={s}>{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tage.map((tag) => (
              <tr key={tag}>
                <td>{tag}</td>
                {schichten.map((schicht) => {
                  const personen = dienstplan?.[weekKey]?.[tag]?.[schicht] || [];
                  const hatZFA = personen.some((name) =>
                    mitarbeiter.find((m) => m.name === name && m.rolle === "ZFA")
                  );

                  return (
                    <td key={schicht} style={{ border: "1px solid #999", padding: "0.5rem" }}>
                      {personen.map((name) => (
                        <div key={name} style={{ display: "flex", justifyContent: "space-between" }}>
                          {name}
                          <button onClick={() => removePerson(tag, schicht, name)}>×</button>
                        </div>
                      ))}
                      {!hatZFA && (
                        <div style={{ color: "red", fontSize: "0.8rem" }}>
                          ⚠️ Keine ZFA eingeteilt!
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
