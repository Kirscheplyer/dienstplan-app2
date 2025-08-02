
import React, { useEffect, useState } from "react";
import "./style.css";

export default function DienstplanApp() {
  const [mitarbeiter, setMitarbeiter] = useState([]);
  const [dienstplan, setDienstplan] = useState([
    { tag: "Montag" },
    { tag: "Dienstag" },
    { tag: "Mittwoch" },
    { tag: "Donnerstag" },
    { tag: "Freitag" },
  ]);

  // Lade Mitarbeiterliste aus localStorage
  useEffect(() => {
    const gespeicherte = JSON.parse(localStorage.getItem("mitarbeiterListe")) || [];
    setMitarbeiter(gespeicherte);
  }, []);

  const getSchichtMitarbeiter = (tag, art) => {
    const passende = mitarbeiter.filter((m) => {
      if (m.rolle === "Azubi" && art === "Früh") return false;
      return true;
    });
    return passende.map((m) => m.name).join(", ");
  };

  return (
    <div>
      <h2>Dienstplan</h2>
      <table>
        <thead>
          <tr>
            <th>Tag</th>
            <th>Frühschicht</th>
            <th>Spätschicht</th>
          </tr>
        </thead>
        <tbody>
          {dienstplan.map((eintrag) => (
            <tr key={eintrag.tag}>
              <td>{eintrag.tag}</td>
              <td>{getSchichtMitarbeiter(eintrag.tag, "Früh")}</td>
              <td>{getSchichtMitarbeiter(eintrag.tag, "Spät")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
