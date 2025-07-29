
import React, { useState } from "react";
import "./style.css";

const zfas = ["PC", "AM", "SA"];
const dienstplanData = [
  { tag: "Montag", frueh: "PC", spaet: "AM", springer: "SA" },
  { tag: "Dienstag", frueh: "AM", spaet: "SA", springer: "PC" },
  { tag: "Mittwoch", frueh: "SA", spaet: "PC", springer: "AM" },
  { tag: "Donnerstag", frueh: "PC", spaet: "AM", springer: "SA" },
  { tag: "Freitag", frueh: "AM", spaet: "SA", springer: "PC" },
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
