
import React, { useEffect, useState } from "react";
import "./style.css";

export default function DienstplanApp() {
  const [mitarbeiter, setMitarbeiter] = useState([]);
  const [dienstplan, setDienstplan] = useState({});

  const tage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
  const schichten = ["Früh", "Spät"];

  useEffect(() => {
    const gespeicherte = JSON.parse(localStorage.getItem("mitarbeiterListe")) || [];
    setMitarbeiter(gespeicherte);

    const plan = JSON.parse(localStorage.getItem("dienstplanDND")) || {};
    setDienstplan(plan);
  }, []);

  useEffect(() => {
    localStorage.setItem("dienstplanDND", JSON.stringify(dienstplan));
  }, [dienstplan]);

  const onDrop = (tag, schicht, name) => {
    setDienstplan((prev) => {
      const copy = { ...prev };
      if (!copy[tag]) copy[tag] = {};
      if (!copy[tag][schicht]) copy[tag][schicht] = [];
      if (!copy[tag][schicht].includes(name)) {
        copy[tag][schicht].push(name);
      }
      return copy;
    });
  };

  const removePerson = (tag, schicht, name) => {
    setDienstplan((prev) => {
      const copy = { ...prev };
      copy[tag][schicht] = copy[tag][schicht].filter((n) => n !== name);
      return copy;
    });
  };

  return (
    <div>
      <h2>Dienstplan – Drag & Drop</h2>
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
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
                      {(dienstplan?.[tag]?.[schicht] || []).map((name) => (
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
