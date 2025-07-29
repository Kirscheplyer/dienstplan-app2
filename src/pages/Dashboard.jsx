
import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const kuerzelZuName = {
  PC: "Pam",
  AM: "Andre",
  SA: "Susane",
};

const schichtFarben = {
  Früh: "#a0e7e5",
  Spät: "#b4f8c8",
  Nacht: "#fbc4ab",
};

export default function Dashboard() {
  const [dienstplan, setDienstplan] = useState([]);
  const [gefiltertNach, setGefiltertNach] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("dienstplan");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed[0]?.datum && parsed[0]?.name && parsed[0]?.schicht) {
          setDienstplan(parsed);
        } else {
          setDienstplan([]);
        }
      } catch {
        setDienstplan([]);
      }
    }
  }, []);

  const getAktuelleWoche = () => {
    const heute = new Date();
    const montag = new Date(heute.setDate(heute.getDate() - heute.getDay() + 1));
    const tage = [];
    for (let i = 0; i < 7; i++) {
      const tag = new Date(montag);
      tag.setDate(montag.getDate() + i);
      tage.push(tag.toISOString().split("T")[0]);
    }
    return tage;
  };

  const aktuelleWoche = getAktuelleWoche();
  const gefiltert = dienstplan.filter((eintrag) =>
    aktuelleWoche.includes(eintrag.datum)
  );

  const dienstzeitProName = {};
  gefiltert.forEach(({ name, schicht }) => {
    const realName = kuerzelZuName[name] || name;
    const dauer = schicht === "Früh" || schicht === "Spät" ? 8 : schicht === "Nacht" ? 10 : 0;
    dienstzeitProName[realName] = (dienstzeitProName[realName] || 0) + dauer;
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Dienstplan – Aktuelle Woche</h2>
      <div className="grid grid-cols-7 gap-2 mb-6">
        {aktuelleWoche.map((datum) => (
          <div key={datum} className="border p-2">
            <div className="font-semibold text-sm">{datum}</div>
            {gefiltert
              .filter((e) => e.datum === datum)
              .map((e, idx) => {
                const realName = kuerzelZuName[e.name] || e.name;
                const farbe = schichtFarben[e.schicht] || "#eee";
                return (
                  <div
                    key={idx}
                    className="mt-1 p-1 rounded text-sm"
                    style={{ backgroundColor: farbe }}
                  >
                    {realName} – {e.schicht}
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-2">Wöchentliche Dienstzeit</h3>
      <ul>
        {Object.entries(dienstzeitProName).map(([name, stunden]) => (
          <li key={name}>
            {name}: {stunden} Std
          </li>
        ))}
      </ul>
    </div>
  );
}
