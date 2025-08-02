
import React, { useEffect, useState } from "react";
import "./style.css";

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d - jan1) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + jan1.getDay() + 1) / 7);
  return `KW${week}-${d.getFullYear()}`;
}

export default function DienstplanApp() {
  const [mitarbeiter, setMitarbeiter] = useState([]);
  const [dienstplan, setDienstplan] = useState({});
  const [startDatum, setStartDatum] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() - now.getDay() + 1); // Montag dieser Woche
    return now.toISOString().substring(0, 10);
  });

  const tage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
  const schichten = ["Früh", "Spät"];

  const weekKey = getWeekKey(startDatum);

  useEffect(() => {
    const gespeicherte = JSON.parse(localStorage.getItem("mitarbeiterListe")) || [];
    setMitarbeiter(gespeicherte);

    const plan = JSON.parse(localStorage.getItem("dienstplanDNDWochen")) || {};
    setDienstplan(plan);
  }, []);

  useEffect(() => {
    localStorage.setItem("dienstplanDNDWochen", JSON.stringify(dienstplan));
  }, [dienstplan]);

  const onDrop = (tag, schicht, name) => {
    setDienstplan((prev) => {
      const copy = { ...prev };
      if (!copy[weekKey]) copy[weekKey] = {};
      if (!copy[weekKey][tag]) copy[weekKey][tag] = {};
      if (!copy[weekKey][tag][schicht]) copy[weekKey][tag][schicht] = [];
      if (!copy[weekKey][tag][schicht].includes(name)) {
        copy[weekKey][tag][schicht].push(name);
      }
      return copy;
    });
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
      <h2>Dienstplan – KW-Auswahl & Drag & Drop</h2>

      <label>
        Woche ab (Montag):
        <input
          type="date"
          value={startDatum}
          onChange={(e) => setStartDatum(e.target.value)}
        />
      </label>

      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <div>
          <h3>Mitarbeiter</h3>
          {mitarbeiter.map((m) => (
            <div
              key={m.name}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("name", m.name)}
              style={{
                padding: "0.5rem",
                border: "1px solid #ccc",
                marginBottom: "0.5rem",
                cursor: "grab"
              }}
            >
              {m.name} ({m.rolle})
            </div>
          ))}
        </div>

        <div style={{ flexGrow: 1 }}>
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
                  {schichten.map((schicht) => (
                    <td
                      key={schicht}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const name = e.dataTransfer.getData("name");
                        onDrop(tag, schicht, name);
                      }}
                      style={{
                        minWidth: "120px",
                        border: "1px solid #999",
                        padding: "0.5rem",
                        verticalAlign: "top"
                      }}
                    >
                      {(dienstplan?.[weekKey]?.[tag]?.[schicht] || []).map((name) => (
                        <div
                          key={name}
                          style={{
                            background: "#eee",
                            padding: "2px 5px",
                            marginBottom: "4px",
                            display: "flex",
                            justifyContent: "space-between"
                          }}
                        >
                          {name}
                          <button
                            onClick={() => removePerson(tag, schicht, name)}
                            style={{ marginLeft: "0.5rem" }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
