
import React, { useState } from "react";
import "./style.css";

const zfas = ["Pam", "Andre", "Susanne"];
const dienstplanData = [
  { tag: "Montag", frueh: "Pam", spaet: "Andre", springer: "Susanne" },
  { tag: "Dienstag", frueh: "Andre", spaet: "Susanne", springer: "Pam" },
  { tag: "Mittwoch", frueh: "Susanne", spaet: "Pam", springer: "Andre" },
  { tag: "Donnerstag", frueh: "Pam", spaet: "Andre", springer: "Susanne" },
  { tag: "Freitag", frueh: "Andre", spaet: "Susanne", springer: "Pam" },
];

export default function App() {
  const [nachricht, setNachricht] = useState("");
  const [chatverlauf, setChatverlauf] = useState([]);
  const [privatEmpfaenger, setPrivatEmpfaenger] = useState("");

  const sendeNachricht = () => {
    if (nachricht.trim() !== "") {
      const eintrag = {
        absender: "Du",
        empfaenger: privatEmpfaenger || "Alle",
        text: nachricht
      };
      setChatverlauf([...chatverlauf, eintrag]);
      setNachricht("");
    }
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
          {dienstplanData.map((eintrag, index) => (
            <tr key={index}>
              <td>{eintrag.tag}</td>
              <td>{eintrag.frueh}</td>
              <td>{eintrag.spaet}</td>
              <td>{eintrag.springer}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Team-Chat</h2>
      <div className="chatbox">
        {chatverlauf.map((msg, i) => (
          <div key={i}>
            <b>{msg.absender}</b> ➤ <i>{msg.empfaenger}</i>: {msg.text}
          </div>
        ))}
        <div>
          <input
            type="text"
            placeholder="Nachricht eingeben..."
            value={nachricht}
            onChange={(e) => setNachricht(e.target.value)}
          />
          <select onChange={(e) => setPrivatEmpfaenger(e.target.value)}>
            <option value="">Alle</option>
            {zfas.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button onClick={sendeNachricht}>Senden</button>
        </div>
      </div>
    </div>
  );
}
