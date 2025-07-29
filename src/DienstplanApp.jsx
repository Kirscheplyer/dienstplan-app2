
import React, { useState, useEffect } from "react";
import "./style.css";

export default function DienstplanApp() {
  const [mitarbeiter, setMitarbeiter] = useState([]);
  const [neuerName, setNeuerName] = useState("");
  const [neueRolle, setNeueRolle] = useState("ZFA");
  const [azubiRegeln, setAzubiRegeln] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("mitarbeiterListe");
    if (saved) setMitarbeiter(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("mitarbeiterListe", JSON.stringify(mitarbeiter));
  }, [mitarbeiter]);

  const handleRegelChange = (tag, value) => {
    setAzubiRegeln(prev => ({ ...prev, [tag]: value }));
  };

  const hinzufuegen = () => {
    if (neuerName.trim() === "") return;
    const neuerEintrag = {
      name: neuerName.trim(),
      rolle: neueRolle,
    };
    if (neueRolle === "Azubi") {
      neuerEintrag.regeln = (datum) => {
        const tag = datum.getDay();
        const tage = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
        return azubiRegeln[tage[tag]];
      };
      neuerEintrag.rohdaten = azubiRegeln; // für Anzeige / Debug
    }
    setMitarbeiter([...mitarbeiter, neuerEintrag]);
    setNeuerName("");
    setNeueRolle("ZFA");
    setAzubiRegeln({});
  };

  const entfernen = (name) => {
    setMitarbeiter(mitarbeiter.filter(m => m.name !== name));
  };

  return (
    <div>
      <h2>Mitarbeiterverwaltung</h2>
      <input
        type="text"
        placeholder="Name"
        value={neuerName}
        onChange={(e) => setNeuerName(e.target.value)}
      />
      <select value={neueRolle} onChange={(e) => setNeueRolle(e.target.value)}>
        <option value="ZFA">ZFA</option>
        <option value="Azubi">Azubi</option>
      </select>
      {neueRolle === "Azubi" && (
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <p><b>Wöchentliche Azubi-Regeln:</b></p>
          {["Mo", "Di", "Mi", "Do", "Fr"].map((tag) => (
            <div key={tag}>
              <label>{tag}: </label>
              <input
                type="text"
                placeholder="z.B. Schule ab 11 Uhr / Verfügbar ab 14 Uhr / frei / leer lassen"
                value={azubiRegeln[tag] || ""}
                onChange={(e) => handleRegelChange(tag, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
      <button onClick={hinzufuegen}>Hinzufügen</button>

      <ul>
        {mitarbeiter.map((m, i) => (
          <li key={i}>
            {m.name} ({m.rolle})
            <button onClick={() => entfernen(m.name)} style={{ marginLeft: "1rem" }}>Entfernen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
