
import { useUser, UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

const ADMIN_ID = "user_30NpYU323qGA3LO4JedrBWRQXXP";

export default function Admin() {
  const { user } = useUser();
  const [mitarbeiter, setMitarbeiter] = useState([
    { name: "Aya", rolle: "Azubi" },
    { name: "Chin", rolle: "Azubi" },
  ]);
  const [neuerName, setNeuerName] = useState("");
  const [rolle, setRolle] = useState("Mitarbeiter");

  const hinzufuegen = () => {
    if (!neuerName) return;
    setMitarbeiter([...mitarbeiter, { name: neuerName, rolle }]);
    setNeuerName("");
    setRolle("Mitarbeiter");
  };

  const entfernen = (name) => {
    setMitarbeiter(mitarbeiter.filter((m) => m.name !== name));
  };

  if (user?.id !== ADMIN_ID) {
    return <div>Kein Zugriff</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin: Mitarbeiterverwaltung</h2>
      <div className="mb-4 space-x-2">
        <input
          type="text"
          placeholder="Name"
          value={neuerName}
          onChange={(e) => setNeuerName(e.target.value)}
          className="border px-2 py-1"
        />
        <select
          value={rolle}
          onChange={(e) => setRolle(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="Mitarbeiter">Mitarbeiter</option>
          <option value="Azubi">Azubi</option>
        </select>
        <button onClick={hinzufuegen} className="bg-blue-500 text-white px-4 py-1 rounded">
          Hinzufügen
        </button>
      </div>

      <ul>
        {mitarbeiter.map((m) => (
          <li key={m.name} className="flex justify-between items-center border-b py-1">
            <span>{m.name} – {m.rolle}</span>
            <button
              onClick={() => entfernen(m.name)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Entfernen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
