
import React, { useState, useEffect } from "react";
import "./style.css";

export default function DienstplanApp() {
  const [mitarbeiter, setMitarbeiter] = useState([]);
  const [neuerName, setNeuerName] = useState("");
  const [neueRolle, setNeueRolle] = useState("ZFA");
  const [azubiRegeln, setAzubiRegeln] = useState({
    schultage: [],
    keineSpaet: false,
    nurMoFr: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("mitarbeiterListe");
    if (saved) setMitarbeiter(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("mitarbeiterListe", JSON.stringify(mitarbeiter));
  }, [mitarbeiter]);

  const handleRegelChange = (key, value) => {
    setAzubiRegeln(prev => ({ ...prev, [key]: value }));
  };

  const toggleSchultag = (tag) => {
    setAzubiRegeln(prev => ({
      ...prev,
      schultage: prev.schultage.includes(tag)
        ? prev.schultage.filter(t => t !== tag)
        : [...prev.schultage, tag]
    }));
  };

  const hinzufuegen = () => {
    if (neuerName.trim() === "") return;
    const neuerEintrag = {
      name: neuerName.trim(),
      rolle: neueRolle,
    };
    if (neueRolle === "Azubi") {
      neuerEintrag.rohdaten = azubiRegeln;
    }
    setMitarbeiter([...mitarbeiter, neuerEintrag]);
    setNeuerName("");
    setNeueRolle("ZFA");
    setAzubiRegeln({ schultage: [], keineSpaet: false, nurMoFr: true });
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
        <div style={{ marginTop: "1rem" }}>
          <h4>Azubi-Regeln</h4>
          <label>
            <input
              type="checkbox"
              checked={azubiRegeln.keineSpaet}
              onChange={(e) => handleRegelChange("keineSpaet", e.target.checked)}
            />
            Keine Spätschicht
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={azubiRegeln.nurMoFr}
              onChange={(e) => handleRegelChange("nurMoFr", e.target.checked)}
            />
            Nur Montag–Freitag arbeiten
          </label>
          <br />
          <div style={{ marginTop: "0.5rem" }}>
            <strong>Berufsschultage:</strong><br />
            {["Mo", "Di", "Mi", "Do", "Fr"].map(tag => (
              <label key={tag} style={{ marginRight: "1rem" }}>
                <input
                  type="checkbox"
                  checked={azubiRegeln.schultage.includes(tag)}
                  onChange={() => toggleSchultag(tag)}
                /> {tag}
              </label>
            ))}
          </div>
        </div>
      )}

      <br />
      <button onClick={hinzufuegen}>Hinzufügen</button>

      <ul>
        {mitarbeiter.map((m) => (
          <li key={m.name}>
            {m.name} ({m.rolle}) <button onClick={() => entfernen(m.name)}>Entfernen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
