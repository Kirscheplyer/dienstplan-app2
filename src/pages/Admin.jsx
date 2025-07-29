
import DienstplanApp from "../DienstplanApp";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

const ADMIN_ID = "user_30NpYU323qGA3LO4JedrBWRQXXP";

const mitarbeiterListe = [
  {
    name: "Aya",
    rolle: "Azubi",
    regeln: (datum) => {
      const tag = datum.getDay();
      if (tag === 3) return "Schule ab 11 Uhr";
      if (tag === 5) return "Schule (ganztägig)";
      return null;
    },
  },
  {
    name: "Chin",
    rolle: "Azubi",
    regeln: (datum) => {
      const tag = datum.getDay();
      if (tag === 1) return "Verfügbar ab 14 Uhr";
      if (tag === 2) return "Schule (ganztägig)";
      return null;
    },
  },
  {
    name: "Hyoung",
    rolle: "Azubi",
    regeln: (datum) => {
      const tag = datum.getDay();
      if (tag === 2) return "Verfügbar ab 16 Uhr";
      if (tag === 3) return "Schule ab 10:20 Uhr";
      return null;
    },
  },
  { name: "Pam", rolle: "ZFA" },
  { name: "Andre", rolle: "ZFA" },
  { name: "Susanne", rolle: "ZFA" },
];

const schichtzeiten = {
  moDo: {
    früh: "07:30 - 14:30",
    spät: "13:30 - 20:30"
  },
  fr: {
    früh: "07:30 - 13:30",
    spät: "12:30 - 18:30"
  }
};

export default function Admin() {
  const { user } = useUser();
  const [dienstplan, setDienstplan] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("dienstplan");
    if (data) {
      setDienstplan(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dienstplan", JSON.stringify(dienstplan));
  }, [dienstplan]);

  const handleEdit = (index, neueSchicht) => {
    const kopie = [...dienstplan];
    kopie[index].schicht = neueSchicht;
    setDienstplan(kopie);
  };

  if (user?.id !== ADMIN_ID) {
    return <div style={{ padding: "2rem" }}>Zugriff verweigert – nur für Admin.</div>;
  }

  const generateDienstplan = () => {
    const heute = new Date();
    const neuerPlan = [];

    for (let woche = 0; woche < 2; woche++) {
      for (let tag = 0; tag < 7; tag++) {
        const datum = new Date(heute);
        datum.setDate(heute.getDate() + woche * 7 + tag);
        const wochentag = datum.getDay();
        const datumStr = datum.toISOString().split("T")[0];

        if (wochentag >= 1 && wochentag <= 5) {
          mitarbeiterListe.forEach((m, i) => {
            let einsatz = "-";

            if (m.rolle === "Azubi") {
              const regel = m.regeln?.(datum);
              if (!regel) {
                const zeiten = (wochentag === 5) ? schichtzeiten["fr"] : schichtzeiten["moDo"];
                einsatz = i % 2 === 0 ? `Früh (${zeiten.früh})` : `Spät (${zeiten.spät})`;
              } else if (regel.includes("ab")) {
                einsatz = `Teilzeit (${regel})`;
              } else {
                einsatz = regel;
              }
            } else {
              const zeiten = (wochentag === 5) ? schichtzeiten["fr"] : schichtzeiten["moDo"];
              einsatz = i % 2 === 0 ? `Früh (${zeiten.früh})` : `Spät (${zeiten.spät})`;
            }

            neuerPlan.push({
              datum: datumStr,
              name: m.name,
              schicht: einsatz,
            });
          });
        }
      }
    }

    setDienstplan(neuerPlan);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Admin-Bereich</h1>

      <section>
        <h2>Dienstplan automatisch generieren</h2>
        <button onClick={generateDienstplan}>2-Wochen-Dienstplan erstellen</button>
      </section>

      <section>
        <h2>Aktueller Dienstplan</h2>
        {dienstplan.length === 0 ? (
          <p>Noch keine Schichten generiert.</p>
        ) : (
          <table border="1" cellPadding="5" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Name</th>
                <th>Schicht</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {dienstplan.map((eintrag, index) => (
                <tr key={index}>
                  <td>{eintrag.datum}</td>
                  <td>{eintrag.name}</td>
                  <td>{eintrag.schicht}</td>
                  <td>
                    <select value={eintrag.schicht} onChange={(e) => handleEdit(index, e.target.value)}>
                      <option value="Früh (07:30 - 14:30)">Früh (07:30 - 14:30)</option>
                      <option value="Spät (13:30 - 20:30)">Spät (13:30 - 20:30)</option>
                      <option value="Früh (07:30 - 13:30)">Früh (07:30 - 13:30)</option>
                      <option value="Spät (12:30 - 18:30)">Spät (12:30 - 18:30)</option>
                      <option value="Schule (ganztägig)">Schule (ganztägig)</option>
                      <option value="Teilzeit (Verfügbar ab 14 Uhr)">Teilzeit (Verfügbar ab 14 Uhr)</option>
                      <option value="Teilzeit (Verfügbar ab 16 Uhr)">Teilzeit (Verfügbar ab 16 Uhr)</option>
                      <option value="Schule ab 11 Uhr">Schule ab 11 Uhr</option>
                      <option value="Schule ab 10:20 Uhr">Schule ab 10:20 Uhr</option>
                      <option value="Frei">Frei</option>
                      <option value="-">-</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

  return (
    <div style={{ padding: "2rem" }}>
      <UserButton />
      <h1>Admin-Bereich</h1>

      <section>
        <h2>Dienstplan automatisch generieren</h2>
        <button onClick={generateDienstplan}>2-Wochen-Dienstplan erstellen</button>
      </section>

      <section>
        <h2>Aktueller Dienstplan</h2>
        {dienstplan.length === 0 ? (
          <p>Noch keine Schichten generiert.</p>
        ) : (
          <table border="1" cellPadding="5" style={ marginTop: "1rem" }>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Name</th>
                <th>Schicht</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {dienstplan.map((eintrag, index) => (
                <tr key={index}>
                  <td>{eintrag.datum}</td>
                  <td>{eintrag.name}</td>
                  <td>{eintrag.schicht}</td>
                  <td>
                    <select value={eintrag.schicht} onChange={(e) => handleEdit(index, e.target.value)}>
                      <option value="Früh (07:30 - 14:30)">Früh (07:30 - 14:30)</option>
                      <option value="Spät (13:30 - 20:30)">Spät (13:30 - 20:30)</option>
                      <option value="Früh (07:30 - 13:30)">Früh (07:30 - 13:30)</option>
                      <option value="Spät (12:30 - 18:30)">Spät (12:30 - 18:30)</option>
                      <option value="Schule (ganztägig)">Schule (ganztägig)</option>
                      <option value="Teilzeit (Verfügbar ab 14 Uhr)">Teilzeit (Verfügbar ab 14 Uhr)</option>
                      <option value="Teilzeit (Verfügbar ab 16 Uhr)">Teilzeit (Verfügbar ab 16 Uhr)</option>
                      <option value="Schule ab 11 Uhr">Schule ab 11 Uhr</option>
                      <option value="Schule ab 10:20 Uhr">Schule ab 10:20 Uhr</option>
                      <option value="Frei">Frei</option>
                      <option value="-">-</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={ marginTop: "3rem" }>
        <h2>Mitarbeiterverwaltung (Testfunktion)</h2>
        <DienstplanApp />
      </section>
    </div>
  );
}
