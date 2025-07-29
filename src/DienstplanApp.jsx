
import React from "react";
import "./style.css";

const wochentage = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const dienstplan = {
  Pam:   ["Früh", "–", "Spät", "–", "Nacht", "–", "Früh"],
  Andre: ["Spät", "Früh", "–", "Spät", "–", "Nacht", "–"],
  Susanne: ["–", "–", "Früh", "Früh", "–", "Spät", "Nacht"]
};

export default function DienstplanApp() {
  return (
    <div className="app">
      <h2>📅 Beispielstruktur:</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {wochentage.map((tag) => (
              <th key={tag}>{tag}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(dienstplan).map(([name, schichten]) => (
            <tr key={name}>
              <td><strong>{name}</strong></td>
              {schichten.map((schicht, i) => (
                <td key={i}>{schicht}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
