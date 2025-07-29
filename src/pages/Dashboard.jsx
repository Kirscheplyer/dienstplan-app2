
import { UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const ADMIN_ID = "user_30NpYU323qGA3LO4JedrBWRQXXP";

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
  const { user } = useUser();
  const [dienstplan, setDienstplan] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("dienstplan");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setDienstplan(parsed);
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

  const tage = getAktuelleWoche();
  const planMap = {};

  dienstplan.forEach(({ datum, name, schicht }) => {
    const realName = kuerzelZuName[name] || name;
    if (!tage.includes(datum)) return;
    if (!planMap[realName]) {
      planMap[realName] = {};
    }
    planMap[realName][datum] = schicht;
  });

  const dienstzeitProName = {};
  Object.entries(planMap).forEach(([name, eintraege]) => {
    dienstzeitProName[name] = Object.values(eintraege).reduce((summe, schicht) => {
      const dauer = schicht === "Früh" || schicht === "Spät" ? 8 : schicht === "Nacht" ? 10 : 0;
      return summe + dauer;
    }, 0);
  });

  const tageKopf = tage.map((datum) => {
    const d = new Date(datum);
    return d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dienstplan – Kalenderansicht</h2>
      <div className="overflow-auto">
        <table className="table-auto border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border text-left">Mitarbeiter</th>
              {tageKopf.map((t, i) => (
                <th key={i} className="p-2 border text-center">{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(planMap).map(([name, tageEintrag]) => (
              <tr key={name}>
                <td className="p-2 border font-semibold">{name}</td>
                {tage.map((datum) => {
                  const schicht = tageEintrag[datum] || "";
                  const farbe = schichtFarben[schicht] || "#fff";
                  return (
                    <td
                      key={datum}
                      className="p-2 border text-center"
                      style={{ backgroundColor: farbe }}
                    >
                      {schicht}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user?.id === ADMIN_ID && (
        <>
          <h3 className="text-lg font-semibold mt-4 mb-2">Wöchentliche Dienstzeit (nur Admin)</h3>
          <ul>
            {Object.entries(dienstzeitProName).map(([name, stunden]) => (
              <li key={name}>
                {name}: {stunden} Std
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
