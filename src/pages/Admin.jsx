import { useUser, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const ADMIN_ID = "user_30NpYU323qGA3LO4JedrBWRQXXP";

export default function Admin() {
  const { user } = useUser();
  const [mitarbeiter, setMitarbeiter] = useState([]);
  const [name, setName] = useState("");
  const [rolle, setRolle] = useState("ZFA");
  const [regel, setRegel] = useState("");

  // Laden bei Start
  useEffect(() => {
    const gespeicherte = JSON.parse(localStorage.getItem("mitarbeiterListe")) || [];
    setMitarbeiter(gespeicherte);
  }, []);

  // Speichern in localStorage
  const speichern = (liste) => {
    localStorage.setItem("mitarbeiterListe", JSON.stringify(liste));
  };

  const hinzufuegen = () => {
    if (!name.trim()) return;
    const neu = { name: name.trim(), rolle, regel };
    const neueListe = [...mitarbeiter, neu];
    setMitarbeiter(neueListe);
    speichern(neueListe);
    setName("");
    setRolle("ZFA");
    setRegel("");
  };

  const entfernen = (name) => {
    const neueListe = mitarbeiter.filter(m => m.name !== name);
    setMitarbeiter(neueListe);
    speichern(neueListe);
  };

  if (user?.id !== ADMIN_ID) return <p>Zugriff verweigert.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Admin-Bereich</h1>

      <h2>Neuen Mitarbeiter hinzufügen</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <select value={rolle} onChange={e => setRolle(e.target.value)}>
        <option value="ZFA">ZFA</option>
        <option value="Azubi">Azubi</option>
      </select>
      <input placeholder="Regel (optional)" value={regel} onChange={e => setRegel(e.target.value)} />
      <button onClick={hinzufuegen}>Hinzufügen</button>

      <h2>Mitarbeiterliste</h2>
      <ul>
        {mitarbeiter.map((m, i) => (
          <li key={i}>
            <strong>{m.name}</strong> ({m.rolle}) {m.regel && <>– Regel: {m.regel}</>}
            <button onClick={() => entfernen(m.name)} style={{ marginLeft: "1rem" }}>Entfernen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
