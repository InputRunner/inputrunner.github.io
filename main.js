import { h, render } from "preact";
import htm from "htm";
const html = htm.bind(h);

import {
  useState,
  useEffect
} from "https://cdn.jsdelivr.net/npm/preact@10.20.1/hooks/dist/hooks.module.js";

// --- Channel "scanning" simulation (demo) ---
const FAKE_CHANNELS = [
  { id: 1, name: "BBC One", freq: "482 MHz", size: 1, position: 1, stdName: "BBC One" },
  { id: 2, name: "CNN", freq: "506 MHz", size: 1, position: 2, stdName: "CNN" },
  { id: 3, name: "Discovery", freq: "530 MHz", size: 1, position: 3, stdName: "Discovery" },
  { id: 4, name: "Animal Planet", freq: "554 MHz", size: 1, position: 4, stdName: "Animal Planet" }
];

function AddInputModal({ onAdd, onClose }) {
  let input;
  return html`
    <div class="hdmi-player-modal" style="background:rgba(30,30,30,0.92)">
      <div class="hdmi-player-header" style="font-size:1.5rem;margin-bottom:12px;">Add Input</div>
      <form onSubmit=${e => {
        e.preventDefault();
        if (input.value.trim()) {
          onAdd(input.value.trim());
        }
        onClose();
      }} style="display:flex;flex-direction:column;align-items:center;gap:13px;">
        <input
          ref=${el => input = el}
          type="text"
          placeholder="Input name"
          style="padding:8px 12px;font-size:1rem;border-radius:7px;border:1px solid #444;outline:none;min-width:200px;margin-bottom:7px;"
          autofocus
        />
        <div style="display:flex;gap:13px">
          <button type="submit" style="font-size:1.05rem;background:#98fc66;border:none;padding:6px 21px;border-radius:7px;color:#161;font-weight:bold;cursor:pointer;">Add</button>
          <button type="button" style="font-size:1.05rem;background:#eee;border:none;padding:6px 21px;border-radius:7px;color:#444;font-weight:bold;cursor:pointer;" onClick=${onClose}>Cancel</button>
        </div>
      </form>
    </div>
  `;
}

// Settings gear icon SVG
const GearIcon = html`
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="8" stroke="#b6e3ff" stroke-width="2" fill="none"/>
    <path d="M16 2v4M16 26v4M2 16h4M26 16h4M6.22 6.22l2.83 2.83M22.95 22.95l2.83 2.83M22.95 9.05l2.83-2.83M6.22 25.78l2.83-2.83" stroke="#b6e3ff" stroke-width="2"/>
  </svg>
`;

// --- Settings Modal & Broadcast Management --- //
function SettingsModal({ onClose, scannedChannels, onScan, channels, setChannels }) {
  const [tab, setTab] = useState("scan");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [editField, setEditField] = useState(null);

  function handleRename(id, field) {
    setRenamingId(id);
    setEditField(field);
    const channel = channels.find(ch => ch.id === id);
    setRenameValue(channel[field]);
  }

  function commitRename(id, field) {
    setChannels(chans => chans.map(ch =>
      ch.id === id ? { ...ch, [field]: field === "size" || field === "position" ? Number(renameValue) : renameValue } : ch
    ));
    setRenamingId(null);
    setEditField(null);
    setRenameValue("");
  }

  return html`
    <div class="settings-modal">
      <div class="settings-header">
        <div style="font-size:1.35rem; font-weight:bold">Settings</div>
        <button class="settings-close-btn" onClick=${onClose}>✕</button>
      </div>
      <div class="settings-tabs">
        <button onClick=${() => setTab("scan")} class=${tab === "scan" ? "active" : ""}>Scan Channels</button>
        <button onClick=${() => setTab("broadcast")} class=${tab === "broadcast" ? "active" : ""}>Broadcast</button>
      </div>
      <div class="settings-body">
        ${tab === "scan" && html`
          <div style="padding:20px;text-align:center">
            <div style="font-size:1.1rem;margin-bottom:15px;">Start automatic scan for Live TV channels available on your TV.</div>
            <button class="scan-btn" style="margin-bottom:19px;" onClick=${onScan}>Scan Channels</button>
            <div class="scan-results">
              ${scannedChannels.length === 0 && html`<div style="color:#778ba7">No channels scanned yet.</div>`}
              ${scannedChannels.length > 0 && html`
                <ul>
                  ${scannedChannels.map(ch => html`<li key=${ch.id} style="margin-bottom:4px">${ch.name} <span style="color:#7ac">(${ch.freq})</span></li>`)}
                </ul>
              `}
            </div>
          </div>
        `}
        ${tab === "broadcast" && html`
          <div style="padding:20px;">
            <div style="font-weight:bold;margin-bottom:10px;font-size:1.15rem;">Manage Scanned Channels</div>
            <div class="channels-editor-list">
              ${channels.length === 0 && html`<div style="color:#778ba7">No channels to arrange. <span style="font-size:0.95em">(Scan first)</span></div>`}
              ${channels.length > 0 && html`
                <table class="channels-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Name</th>
                      <th>Freq</th>
                      <th>Size</th>
                      <th>Standardized Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${channels.map((ch, idx) => html`
                      <tr key=${ch.id}>
                        <td>
                          ${renamingId === ch.id && editField === "position" ? html`
                            <input
                              type="number"
                              min="1"
                              style="width:44px"
                              value=${renameValue}
                              onInput=${e=>setRenameValue(e.target.value)}
                              onBlur=${()=>commitRename(ch.id,"position")}
                              onKeyDown=${e=>e.key==="Enter"?commitRename(ch.id,"position"):null}
                              autofocus
                            />
                          ` : html`
                            <span 
                              class="editable"
                              onClick=${()=>handleRename(ch.id,"position")}
                              title="Click to edit"
                            >${ch.position}</span>
                          `}
                        </td>
                        <td>
                          ${renamingId === ch.id && editField === "name" ? html`
                            <input
                              type="text"
                              style="width:88px"
                              value=${renameValue}
                              onInput=${e=>setRenameValue(e.target.value)}
                              onBlur=${()=>commitRename(ch.id,"name")}
                              onKeyDown=${e=>e.key==="Enter"?commitRename(ch.id,"name"):null}
                              autofocus
                            />
                          ` : html`
                            <span 
                              class="editable"
                              onClick=${()=>handleRename(ch.id,"name")}
                              title="Click to edit"
                            >${ch.name}</span>
                          `}
                        </td>
                        <td>
                          <span style="color:#7ac;">${ch.freq}</span>
                        </td>
                        <td>
                          ${renamingId === ch.id && editField === "size" ? html`
                            <input
                              type="number"
                              min="1"
                              style="width:44px"
                              value=${renameValue}
                              onInput=${e=>setRenameValue(e.target.value)}
                              onBlur=${()=>commitRename(ch.id,"size")}
                              onKeyDown=${e=>e.key==="Enter"?commitRename(ch.id,"size"):null}
                              autofocus
                            />
                          ` : html`
                            <span 
                              class="editable"
                              onClick=${()=>handleRename(ch.id,"size")}
                              title="Click to edit"
                            >${ch.size}</span>
                          `}
                        </td>
                        <td>
                          ${renamingId === ch.id && editField === "stdName" ? html`
                            <input
                              type="text"
                              style="width:120px"
                              value=${renameValue}
                              onInput=${e=>setRenameValue(e.target.value)}
                              onBlur=${()=>commitRename(ch.id,"stdName")}
                              onKeyDown=${e=>e.key==="Enter"?commitRename(ch.id,"stdName"):null}
                              autofocus
                            />
                          ` : html`
                            <span 
                              class="editable"
                              onClick=${()=>handleRename(ch.id,"stdName")}
                              title="Click to edit standardized name"
                            >${ch.stdName}</span>
                          `}
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              `}
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}

// Modal to play input source video
function InputPlayerModal({ source, onClose }) {
  const [playerSize, setPlayerSize] = useState(1); // 1 = normal, increase/decrease

  useEffect(() => {
    function handleKey(e) {
      if (
        e.key === "Backspace" ||
        e.key === "Escape" ||
        e.key === "VK_BACK" ||
        e.key === "BACK" ||
        e.keyCode === 461 ||
        e.keyCode === 412
      ) {
        onClose();
        e.preventDefault();
        return;
      }
      // Page Up (increase size)
      if (e.key === "PageUp" || e.keyCode === 33) {
        setPlayerSize(size => Math.min(size + 1, 3)); // max 3x
        e.preventDefault();
      }
      // Page Down (decrease size)
      if (e.key === "PageDown" || e.keyCode === 34) {
        setPlayerSize(size => Math.max(size - 1, 1)); // min 1x
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  let videoType = "service/webos-external";

  // Compute width/height according to playerSize
  let widthPercent, heightPercent;
  // Normal: 50%/56vh, Larger: 75%/77vh, Largest: 96%/85vh
  if (playerSize === 1) {
    widthPercent = "50vw";
    heightPercent = "56vh";
  } else if (playerSize === 2) {
    widthPercent = "75vw";
    heightPercent = "77vh";
  } else {
    widthPercent = "96vw";
    heightPercent = "85vh";
  }

  return html`
    <div class="hdmi-player-modal" tabIndex="0">
      <div class="hdmi-player-header">${source.name} - Live</div>
      <div class="hdmi-video-wrap">
        <video
          autoplay
          style=${`
            width: ${widthPercent};
            height: ${heightPercent};
            max-width: 99vw;
            max-height: 92vh;
            box-shadow: 0 6px 32px #000d;
            border-radius: 14px;
            transition: width 0.21s, height 0.21s;
          `}
          controls
        >
          <source type=${videoType} src=${source.videoSrc}></source>
        </video>
      </div>
      <div id="hdmi-close-tip">
        (Press <b>Backspace</b>, <b>BACK</b> or your remote's BACK key to exit)
        <br/>
        (Press <b>Page Up</b> / <b>Page Down</b> to ${playerSize<3?"increase":"decrease"} player size)
      </div>
    </div>
  `;
}

function SourceCard({ source, selected, onClick }) {
  // A single large number and label based on source type
  let num = "";
  let label = "";
  let extraClass = "";

  if (source.type === "hdmi") {
    num = (parseInt(source.key.replace(/\D/g,""))).toString();
    label = "HDMI";
  } else if (source.type === "av") {
    num = (parseInt(source.key.replace(/\D/g,""))).toString();
    label = "AV";
  } else if (source.type === "comp") {
    num = "1";
    label = "COMP";
    extraClass = "comp";
  } else if (source.type === "scart") {
    num = "1";
    label = "SCART";
    extraClass = "scart";
  } else if (source.type === "livetv") {
    num = source.key.replace(/^\D+/,"");
    label = "TV";
    extraClass = "livetv";
  }

  return html`
    <div
      class=${"hdmi-card" + (selected ? " selected" : "") + (extraClass ? " "+extraClass : "")}
      tabIndex="0"
      onClick=${onClick}
      aria-label=${source.name}
    >
      <span class=${"hdmi-label" + (extraClass === "comp" ? " comp" : "")}>${label}</span>
      <span class="hdmi-num">${num}</span>
    </div>
  `;
}

function App() {
  const [inputs, setInputs] = useState([]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [playingIdx, setPlayingIdx] = useState(null);

  // Channel scan state
  const [scannedChannels, setScannedChannels] = useState([]);
  const [channels, setChannels] = useState([]);

  // Scan "simulation"
  function scanChannels() {
    setTimeout(() => {
      setScannedChannels(FAKE_CHANNELS);
      setChannels(FAKE_CHANNELS.map(ch => ({ ...ch }))); // Deep copy
    }, 800); // simulate delay
  }

  // Keyboard nav for sources
  useEffect(() => {
    function onKeyDown(e) {
      if (playingIdx !== null || showSettings || showAddInput) {
        return;
      }
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      let handled = false;
      if (e.key === "ArrowLeft") {
        setSelectedIdx(n => (n - 1 + INPUT_SOURCES.length) % INPUT_SOURCES.length);
        handled = true;
      } else if (e.key === "ArrowRight") {
        setSelectedIdx(n => (n + 1) % INPUT_SOURCES.length);
        handled = true;
      } else if (e.key === "Enter") {
        setPlayingIdx(selectedIdx);
        handled = true;
      }
      if (handled) e.preventDefault();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIdx, playingIdx, showSettings, showAddInput]);

  // Input sources (HDMIs/AV/COMP, etc) UI only, rearrange as wanted
  const INPUT_SOURCES = [
    {
      type: "hdmi",
      key: "hdmi1",
      name: "HDMI 1",
      videoSrc: "ext://hdmi:1"
    },
    {
      type: "hdmi",
      key: "hdmi2",
      name: "HDMI 2",
      videoSrc: "ext://hdmi:2"
    },
    {
      type: "hdmi",
      key: "hdmi3",
      name: "HDMI 3",
      videoSrc: "ext://hdmi:3"
    },
    {
      type: "hdmi",
      key: "hdmi4",
      name: "HDMI 4",
      videoSrc: "ext://hdmi:4"
    },
    {
      type: "av",
      key: "av1",
      name: "AV 1",
      videoSrc: "ext://av:1"
    },
    {
      type: "av",
      key: "av2",
      name: "AV 2",
      videoSrc: "ext://av:2"
    },
    {
      type: "comp",
      key: "comp1",
      name: "Component 1",
      videoSrc: "ext://comp:1"
    },
    {
      type: "scart",
      key: "scart1",
      name: "SCART 1",
      videoSrc: "ext://scart:1"
    },
    {
      type: "livetv",
      key: "livetv1",
      name: "Live TV 1",
      videoSrc: "atv://cable:1/dvb/1"
    },
    {
      type: "livetv",
      key: "livetv2",
      name: "Live TV 2",
      videoSrc: "atv://cable:2/dvb/2"
    }
  ];

  return html`
    <div>
      <div id="top-bar">
        <button id="add-input-btn" onClick=${() => setShowAddInput(true)}>+</button>
        <button 
          id="settings-btn"
          title="Settings"
          style="margin-left:18px;"
          onClick=${()=>setShowSettings(true)}
        >${GearIcon}</button>
      </div>
      <div id="main-content">
        <div class="hdmi-list">
          ${INPUT_SOURCES.map((src, i) =>
            html`
              <${SourceCard}
                key=${src.key}
                source=${src}
                selected=${selectedIdx === i && playingIdx === null}
                onClick=${() => {
                  setSelectedIdx(i);
                  setPlayingIdx(i);
                }}
              />
            `
          )}
        </div>
        <div style="margin-top:9px;font-size:1.17rem;color:#b4ffa5;">
          (Use ← → and <b>Enter</b> to navigate, <b>Backspace</b>, <b>BACK</b> to exit input)
        </div>
        <div id="input-list">
          ${inputs.map((inp, i) => html`
            <div class="input-item" key=${i}>${inp}</div>
          `)}
        </div>
      </div>
      ${showAddInput && html`
         <${AddInputModal}
           onAdd=${name => setInputs(arr => [...arr, name])}
           onClose=${() => setShowAddInput(false)}
         />
      `}
      ${playingIdx !== null && html`
        <${InputPlayerModal}
          source=${INPUT_SOURCES[playingIdx]}
          onClose=${() => setPlayingIdx(null)}
        />
      `}
      ${showSettings && html`
        <${SettingsModal}
          onClose=${()=>setShowSettings(false)}
          scannedChannels=${scannedChannels}
          onScan=${scanChannels}
          channels=${channels}
          setChannels=${setChannels}
        />
      `}
    </div>
  `;
}

render(html`<${App}/>`, document.getElementById("app"));