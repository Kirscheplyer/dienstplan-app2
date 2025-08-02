
import { useEffect, useState } from "react";

// Lokale Mitarbeiterliste aus dem Speicher laden oder leeren Array
const loadMitarbeiter = () =>
  JSON.parse(localStorage.getItem("mitarbeiterListe")) || [];

export default function Admin() {
  const [mitarbeiterListe, setMitarbeiterListe] = useState(loadMitarbeiter);
  const [name, setName] = useState("");
  const [rolle, setRolle] = useState("Azubi");

  // Änderungen automatisch in localStorage speichern
  useEffect(() => {
    localStorage.setItem("mitarbeiterListe", JSON.stringify(mitarbeiterListe));
  }, [mitarbeiterListe]);

  const addMitarbeiter = () => {
    if (!name.trim()) return;
    const neuerMitarbeiter = {
      name,
      rolle,
      regeln: (datum) => null, // Standard: keine Regeln
    };
    setMitarbeiterListe([...mitarbeiterListe, neuerMitarbeiter]);
    setName("");
    setRolle("Azubi");
  };

  const removeMitarbeiter = (nameToRemove) => {
    setMitarbeiterListe(
      mitarbeiterListe.filter((m) => m.name !== nameToRemove)
    );
  };

  return (
    <div>
      <h2>Mitarbeiter verwalten</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={rolle} onChange={(e) => setRolle(e.target.value)}>
        <option value="Azubi">Azubi</option>
        <option value="ZFA">ZFA</option>
      </select>
      <button onClick={addMitarbeiter}>Hinzufügen</button>

      <ul>
        {mitarbeiterListe.map((m) => (
          <li key={m.name}>
            {m.name} ({m.rolle}){" "}
            <button onClick={() => removeMitarbeiter(m.name)}>Entfernen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
