import { h, render } from "preact";
import htm from "htm";
const html = htm.bind(h);
import { useState } from "preact/hooks";

function App() {
  const [inputs, setInputs] = useState([]);
  const [selectedInput, setSelectedInput] = useState(null);
  const [newInputName, setNewInputName] = useState("");

  const INPUT_SOURCES = [
    { id: "hdmi1", name: "HDMI 1", src: "ext://hdmi:1" },
    { id: "hdmi2", name: "HDMI 2", src: "ext://hdmi:2" },
    { id: "av1", name: "AV 1", src: "ext://av:1" },
    { id: "av2", name: "AV 2", src: "ext://av:2" },
    { id: "comp1", name: "COMP 1", src: "ext://comp:1" },
    { id: "scart1", name: "SCART 1", src: "ext://scart:1" },
    { id: "tv1", name: "Live TV 1", src: "atv://cable:1/dvb/1" },
    { id: "tv2", name: "Live TV 2", src: "atv://cable:2/dvb/2" }
  ];

  return html`
    <div>
      <h1>Input Runner - Classic</h1>
      
      <div class="add-input-section">
        <input 
          type="text" 
          value=${newInputName}
          onInput=${e => setNewInputName(e.target.value)}
          placeholder="Add new input"
          class="add-input"
        />
        <button 
          onClick=${() => {
            if (newInputName.trim()) {
              setInputs([...inputs, newInputName.trim()]);
              setNewInputName("");
            }
          }}
        >
          Add Input
        </button>
      </div>

      <div class="input-grid">
        ${INPUT_SOURCES.map(input => html`
          <div 
            key=${input.id}
            class=${"input-item" + (selectedInput === input ? " active" : "")}
            onClick=${() => setSelectedInput(input)}
          >
            ${input.name}
          </div>
        `)}
      </div>

      <div id="controls">
        Custom Inputs:
        ${inputs.map((input, index) => html`
          <div key=${index}>${input}</div>
        `)}
      </div>

      ${selectedInput && html`
        <div class="player-modal" onClick=${() => setSelectedInput(null)}>
          <video autoplay controls>
            <source src=${selectedInput.src} type="service/webos-external"/>
          </video>
        </div>
      `}
    </div>
  `;
}

render(html`<${App}/>`, document.getElementById("app"));