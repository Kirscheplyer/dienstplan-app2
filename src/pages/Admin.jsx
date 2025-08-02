
import { useEffect, useState } from "react";

const defaultMitarbeiter = 
[
  {
    "name": "Pam",
    "rolle": "ZFA",
    "regeln": "default"
  },
  {
    "name": "Andre",
    "rolle": "ZFA",
    "regeln": "default"
  },
  {
    "name": "Susanne",
    "rolle": "Azubi",
    "regeln": "default"
  }
]
;

// Initialisiert Mitarbeiterliste – mit Fallback auf Standard
const loadMitarbeiter = () => {
  const gespeichert = localStorage.getItem("mitarbeiterListe");
  if (gespeichert) return JSON.parse(gespeichert);

  // Beim ersten Mal Standard laden und direkt speichern
  localStorage.setItem("mitarbeiterListe", JSON.stringify(defaultMitarbeiter));
  return defaultMitarbeiter;
};

export default function Admin() {
  const [mitarbeiterListe, setMitarbeiterListe] = useState(loadMitarbeiter);
  const [name, setName] = useState("");
  const [rolle, setRolle] = useState("Azubi");

  useEffect(() => {
    localStorage.setItem("mitarbeiterListe", JSON.stringify(mitarbeiterListe));
  }, [mitarbeiterListe]);

  const addMitarbeiter = () => {
    if (!name.trim()) return;
    const neuerMitarbeiter = {
      name,
      rolle,
      regeln: "default"
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
            {m.name} ({m.rolle}) 
            <button onClick={() => removeMitarbeiter(m.name)}>Entfernen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
