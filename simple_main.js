import { h, render } from "preact";
import htm from "htm";
const html = htm.bind(h);
import {
  useState,
  useEffect
} from "https://cdn.jsdelivr.net/npm/preact@10.20.1/hooks/dist/hooks.module.js";

// -- Channel "scan" sim for Broadcast tab --
const FAKE_CHANNELS = [
  { id: 1, name: "BBC One", freq: "482 MHz", size: 1, position: 1, stdName: "BBC One" },
  { id: 2, name: "CNN", freq: "506 MHz", size: 1, position: 2, stdName: "CNN" },
  { id: 3, name: "Discovery", freq: "530 MHz", size: 1, position: 3, stdName: "Discovery" },
  { id: 4, name: "Animal Planet", freq: "554 MHz", size: 1, position: 4, stdName: "Animal Planet" }
];

const GearIcon = html`
  <svg width="25" height="25" viewBox="0 0 26 26">
    <circle cx="13" cy="13" r="8" stroke="#89ec89" stroke-width="2" fill="none"/>
    <path d="M13 1v4M13 21v4M1 13h4M21 13h4M4.5 4.5l2 2M19.5 19.5l2 2M19.5 6.5l2-2M4.5 21.5l2-2" stroke="#89ec89" stroke-width="2"/>
  </svg>
`;

// -------- Settings Modal --------
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
      <div class="settings-content">
        <div class="settings-header">
          <div>Settings</div>
          <button class="settings-close-btn" onClick=${onClose}>✕</button>
        </div>
        <div class="settings-tabs">
          <button onClick=${() => setTab("scan")} class=${tab==="scan"?"active":""}>Scan</button>
          <button onClick=${() => setTab("broadcast")} class=${tab==="broadcast"?"active":""}>Broadcast</button>
        </div>
        <div class="settings-body">
          ${tab==="scan" && html`
            <div style="text-align:center">
              <div style="margin-bottom:10px;">Scan for Live TV channels available.</div>
              <button class="scan-btn" onClick=${onScan}>Scan Channels</button>
              <div class="scan-results" style="margin:9px 0 0 0;">
                ${scannedChannels.length === 0 && html`<div style="color:#83e591;">No channels scanned yet.</div>`}
                ${scannedChannels.length>0 && html`
                  <ul>
                    ${scannedChannels.map(ch => html`<li key=${ch.id}>${ch.name} <span style="color:#32d061">(${ch.freq})</span></li>`)}
                  </ul>
                `}
              </div>
            </div>
          `}
          ${tab==="broadcast" && html`
            <div>
              <div style="font-weight:bold;margin-bottom:8px;">Arrange Channels</div>
              <div class="channels-editor-list">
                ${channels.length === 0 && html`<div style="color:#83e591;">No channels yet. <span style="font-size:.96em">(Scan first)</span></div>`}
                ${channels.length > 0 && html`
                  <table class="channels-table">
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>Name</th>
                        <th>Freq</th>
                        <th>Size</th>
                        <th>Std Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${channels.map((ch, idx) => html`
                        <tr key=${ch.id}>
                          <td>
                            ${renamingId===ch.id && editField==="position" ? html`
                              <input type="number" min="1" style="width:35px"
                                value=${renameValue}
                                onInput=${e=>setRenameValue(e.target.value)}
                                onBlur=${()=>commitRename(ch.id,"position")}
                                onKeyDown=${e=>e.key==="Enter"?commitRename(ch.id,"position"):null}
                                autofocus
                              />
                            `:html`
                              <span class="editable" onClick=${()=>handleRename(ch.id,"position")}>${ch.position}</span>
                            `}
                          </td>
                          <td>
                            ${renamingId===ch.id && editField==="name" ? html`
                              <input type="text" style="width:65px"
                                value=${renameValue}
                                onInput=${e=>setRenameValue(e.target.value)}
                                onBlur=${()=>commitRename(ch.id,"name")}
                                onKeyDown=${e=>e.key==="Enter"?commitRename(ch.id,"name"):null}
                                autofocus
                              />
                            `:html`
                              <span class="editable" onClick=${()=>handleRename(ch.id,"name")}>${ch.name}</span>
                            `}
                          </td>
                          <td>
                            <span style="color:#32d061;">${ch.freq}</span>
                          </td>
                          <td>
                            ${renamingId===ch.id&&editField==="size" ? html`
                              <input type="number" min="1" style="width:35px"
                                value=${renameValue}
                                onInput=${e=>setRenameValue(e.target.value)}
                                onBlur=${()=>commitRename(ch.id,"size")}
                                onKeyDown=${e=>e.key==="Enter"?commitRename(ch.id,"size"):null}
                                autofocus
                              />
                            `:html`
                              <span class="editable" onClick=${()=>handleRename(ch.id,"size")}>${ch.size}</span>
                            `}
                          </td>
                          <td>
                            ${renamingId===ch.id&&editField==="stdName" ? html`
                              <input type="text" style="width:90px"
                                value=${renameValue}
                                onInput=${e=>setRenameValue(e.target.value)}
                                onBlur=${()=>commitRename(ch.id,"stdName")}
                                onKeyDown=${e=>e.key==="Enter"?commitRename(ch.id,"stdName"):null}
                                autofocus
                              />
                            `:html`
                              <span class="editable" onClick=${()=>handleRename(ch.id,"stdName")}>${ch.stdName}</span>
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
    </div>
  `;
}

// --- Input Player Modal ---
function InputPlayerModal({ source, onClose }) {
  const [playerSize, setPlayerSize] = useState(1);

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
      if (e.key === "PageUp" || e.keyCode === 33) {
        setPlayerSize(size => Math.min(size + 1, 3));
        e.preventDefault();
      }
      if (e.key === "PageDown" || e.keyCode === 34) {
        setPlayerSize(size => Math.max(size - 1, 1));
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  let width, height;
  if (playerSize === 1) { width = "52vw"; height = "52vh";}
  else if (playerSize === 2) { width = "80vw"; height = "72vh";}
  else { width = "97vw"; height = "86vh"; }

  return html`
    <div class="hdmi-player-modal" tabIndex="0">
      <div class="hdmi-player-header">${source.name}</div>
      <div class="hdmi-video-wrap">
        <video autoplay controls style=${`width:${width};height:${height};`}>
          <source type="service/webos-external" src=${source.videoSrc}></source>
        </video>
      </div>
      <div id="hdmi-close-tip">
        (<b>Backspace</b>, <b>BACK</b> or your remote's BACK key to exit)
        <br/>
        (Page Up / Down to ${playerSize<3?"increase":"decrease"} player size)
      </div>
    </div>
  `;
}

// The input sources data will come from a window.INPUT_SOURCES array, injected in index.html
function SourceCard({ source, selected, onClick }) {
  let num = "", label = "", extraClass = "";
  if (source.type === "hdmi") { num = (parseInt(source.key.replace(/\D/g,""))).toString(); label = "HDMI";}
  else if (source.type === "av") { num = (parseInt(source.key.replace(/\D/g,""))).toString(); label = "AV";}
  else if (source.type === "comp") { num = "1"; label = "COMP";}
  else if (source.type === "scart") { num = "1"; label = "SCART";}
  else if (source.type === "livetv") { num = source.key.replace(/^\D+/,""); label = "TV";}
  return html`
    <div class=${"hdmi-card"+(selected?" selected":"")+(extraClass?" "+extraClass:"")}
      tabIndex="0" onClick=${onClick}>
      <span class="hdmi-label">${label}</span>
      <span class="hdmi-num">${num}</span>
    </div>
  `;
}

function App() {
  const [inputs, setInputs] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [playingIdx, setPlayingIdx] = useState(null);
  const [scannedChannels, setScannedChannels] = useState([]);
  const [channels, setChannels] = useState([]);

  function scanChannels() {
    setTimeout(() => {
      setScannedChannels(FAKE_CHANNELS);
      setChannels(FAKE_CHANNELS.map(ch => ({...ch})));
    }, 600);
  }

  // INPUT_SOURCES from window (set by index.html)
  const INPUT_SOURCES = window.INPUT_SOURCES || [];

  useEffect(() => {
    function onKeyDown(e) {
      if (playingIdx!==null || showSettings) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      let handled = false;
      if (e.key==="ArrowLeft") {
        setSelectedIdx(n=>(n-1+INPUT_SOURCES.length)%INPUT_SOURCES.length);
        handled=true;
      } else if (e.key==="ArrowRight") {
        setSelectedIdx(n=>(n+1)%INPUT_SOURCES.length);
        handled=true;
      } else if (e.key==="Enter") {
        setPlayingIdx(selectedIdx);
        handled=true;
      }
      if (handled) e.preventDefault();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIdx, playingIdx, showSettings, INPUT_SOURCES.length]);

  return html`
    <div>
      <div id="top-bar">
        <button id="settings-btn" title="Settings" onClick=${()=>setShowSettings(true)}>${GearIcon}</button>
      </div>
      <div id="main-content">
        <div class="hdmi-list">
          ${INPUT_SOURCES.map((src,i) =>
            html`<${SourceCard}
              key=${src.key}
              source=${src}
              selected=${selectedIdx===i && playingIdx===null}
              onClick=${()=>{setSelectedIdx(i); setPlayingIdx(i);}}
            />`
          )}
        </div>
        <div id="input-list">
          ${inputs.map((inp,i)=>html`<div class="input-item" key=${i}>${inp}</div>`)}
        </div>
      </div>
      ${playingIdx!==null && html`
        <${InputPlayerModal}
          source=${INPUT_SOURCES[playingIdx]}
          onClose=${()=>setPlayingIdx(null)}
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