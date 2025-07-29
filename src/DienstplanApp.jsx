
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
      neuerEintrag.rohdaten = azubiRegeln;
    }
    setMitarbeiter([...mitarbeiter, neuerEintrag]);
    setNeuerName("");
    setNeueRolle("ZFA");
    setAzubiRegeln({});
  };

  const entfernen = (name) => {
    const gefiltert = mitarbeiter.filter(m => m.name !== name);
    setMitarbeiter(gefiltert);
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
                placeholder="z.B. Schule ab 11 Uhr / Verfügbar ab 14 Uhr"
                value={azubiRegeln[tag] || ""}
                onChange={(e) => handleRegelChange(tag, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
      <button onClick={hinzufuegen}>Hinzufügen</button>

      <h3 style={{ marginTop: "2rem" }}>Aktuelle Mitarbeitendenliste:</h3>
      {mitarbeiter.length === 0 ? (
        <p>Keine Mitarbeitenden gespeichert.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Rolle</th>
              <th>Regeln (Azubi)</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {mitarbeiter.map((m, i) => (
              <tr key={i}>
                <td>{m.name}</td>
                <td>{m.rolle}</td>
                <td>
                  {m.rohdaten
                    ? Object.entries(m.rohdaten)
                        .map(([tag, reg]) => `${tag}: ${reg}`)
                        .join(" | ")
                    : "—"}
                </td>
                <td>
                  <button onClick={() => entfernen(m.name)}>Entfernen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
