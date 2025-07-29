
import React, { useState } from "react";
import "./style.css";

export default function DienstplanApp() {
  const [mitarbeiter, setMitarbeiter] = useState([
    { name: "Pam", rolle: "ZFA" },
    { name: "Andre", rolle: "ZFA" },
    { name: "Susanne", rolle: "Azubi" },
  ]);

  const [neuerName, setNeuerName] = useState("");
  const [neueRolle, setNeueRolle] = useState("ZFA");

  const [dienstplan, setDienstplan] = useState([
    { tag: "Montag" },
    { tag: "Dienstag" },
    { tag: "Mittwoch" },
    { tag: "Donnerstag" },
    { tag: "Freitag" },
  ]);

  const hinzufuegen = () => {
    if (neuerName.trim() === "") return;
    setMitarbeiter([...mitarbeiter, { name: neuerName.trim(), rolle: neueRolle }]);
    setNeuerName("");
    setNeueRolle("ZFA");
  };

  const entfernen = (name) => {
    setMitarbeiter(mitarbeiter.filter(m => m.name !== name));
  };

  const getSchichtMitarbeiter = (tag, art) => {
    const passende = mitarbeiter.filter(m => {
      if (m.rolle === "Azubi" && art === "spaet") return false;
      return true;
    });
    const index = (tag.charCodeAt(0) + art.length) % passende.length;
    return passende[index]?.name || "-";
  };

  return (
    <div className="app">
      <h1>Dienstplan</h1>
      <table>
        <thead>
          <tr>
            <th>Tag</th>
            <th>Früh</th>
            <th>Spät</th>
            <th>Springer</th>
          </tr>
        </thead>
        <tbody>
          {dienstplan.map((eintrag, index) => (
            <tr key={index}>
              <td>{eintrag.tag}</td>
              <td>{getSchichtMitarbeiter(eintrag.tag, "frueh")}</td>
              <td>{getSchichtMitarbeiter(eintrag.tag, "spaet")}</td>
              <td>{getSchichtMitarbeiter(eintrag.tag, "springer")}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
      <button onClick={hinzufuegen}>Hinzufügen</button>

      <ul>
        {mitarbeiter.map((m, i) => (
          <li key={i}>
            {m.name} ({m.rolle})
            <button onClick={() => entfernen(m.name)}>Entfernen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
