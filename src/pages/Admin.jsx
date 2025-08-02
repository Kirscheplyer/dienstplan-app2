
import { useEffect, useState } from "react";

const defaultMitarbeiter = [
  {
    name: "Pam",
    rolle: "ZFA",
    regeln: { Montag: "", Dienstag: "", Mittwoch: "", Donnerstag: "", Freitag: "" }
  },
  {
    name: "Andre",
    rolle: "ZFA",
    regeln: { Montag: "", Dienstag: "", Mittwoch: "", Donnerstag: "", Freitag: "" }
  },
  {
    name: "Susanne",
    rolle: "Azubi",
    regeln: {
      Montag: "",
      Dienstag: "Schule (ganztägig)",
      Mittwoch: "",
      Donnerstag: "",
      Freitag: "Schule (ganztägig)"
    }
  }
];

const loadMitarbeiter = () => {
  const gespeichert = localStorage.getItem("mitarbeiterListe");
  if (gespeichert) return JSON.parse(gespeichert);

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
      regeln: { Montag: "", Dienstag: "", Mittwoch: "", Donnerstag: "", Freitag: "" }
    };
    setMitarbeiterListe([...mitarbeiterListe, neuerMitarbeiter]);
    setName("");
    setRolle("Azubi");
  };

  const removeMitarbeiter = (nameToRemove) => {
    setMitarbeiterListe(mitarbeiterListe.filter((m) => m.name !== nameToRemove));
  };

  const updateRegel = (personIndex, tag, wert) => {
    const neueListe = [...mitarbeiterListe];
    neueListe[personIndex].regeln[tag] = wert;
    setMitarbeiterListe(neueListe);
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
        {mitarbeiterListe.map((m, index) => (
          <li key={m.name}>
            <strong>{m.name}</strong> ({m.rolle})
            <button onClick={() => removeMitarbeiter(m.name)}>Entfernen</button>
            <div style={{ marginLeft: "1rem" }}>
              {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].map((tag) => (
                <div key={tag}>
                  {tag}:{" "}
                  <input
                    type="text"
                    value={m.regeln?.[tag] || ""}
                    onChange={(e) => updateRegel(index, tag, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
