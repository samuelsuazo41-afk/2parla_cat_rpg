// main.js - Lógica de RPG Parla Cat v2
let musicaActivada = true;
let BIBLIOTECA_EMOJIS_BASE = [];
let FRASES_MINIJOC = [];
let FRASES_MIXTAS = [];
let NIVELL_MINIJOC = {
  minEmojis: 2,
  maxEmojis: 5,
  nivelActual: 1
};

const LANGS = {
  es: {
    app_titol: "RPG Parla Cat v2 - Crónicas de Cataluña",
    monedes: "Monedas",
    tab_mapa: "Mundo",
    tab_missio: "Misión",
    tab_gremi: "Gremio",
    tab_botiga: "Tienda",
    text_mon: "🗺️ Mapa de Catalunya",
    text_botiga: "🛒 Tienda",
    entrar: "Entrar",
    bloquejat: "Bloqueado",
    completat: "Completado",
    repetir: "Repetir",
    volver_mapa: "Volver al mapa",
    mision_completada: "¡Misión completada!",
    item_desbloquejat: "¡Item desbloqueado!",
    ruta_secreta: "Ruta secreta desbloquejada!",
    repas_rapido: "Repàs Ràpid",
    repas_titulo: "Repàs Ràpid - 5 Preguntes",
    tria_personatge: "Tria el teu personatge",
    nom_personatge: "Com et dius?",
    canviar_personatge: "Canviar Personatge",
    biblioteca: "Biblioteca",
    biblioteca_desc: "Tots els personatges disponibles per les teves històries",
    minijoc_titol: "Arma la frase",
    minijoc_desc: "Tria els emojis per formar la frase",
    comprovar: "Comprovar",
    correcte: "Correcte!",
    incorrecte: "No és així. Era:",
    no_prou_monedes: "No tens prou monedes!",
    comprat: "Comprat",
    desbloqueja_ruta: "Amb 3 ítems del capítol {n} desbloqueges la ruta secreta de {ciutat}",
    no_frases_disponibles: "Compra més emojis per desbloquejar frases!"
  },
  ca: {
    app_titol: "Parla Cat RPG - Cròniques de Catalunya",
    monedes: "Monedes",
    tab_mapa: "Món",
    tab_missio: "Missió",
    tab_gremi: "Gremi",
    tab_botiga: "Botiga",
    text_mon: "🗺️ Mapa de Catalunya",
    text_botiga: "🛒 Botiga",
    entrar: "Entrar",
    bloquejat: "Bloquejat",
    completat: "Completat",
    repetir: "Repetir",
    volver_mapa: "Tornar al mapa",
    mision_completada: "Missió completada!",
    item_desbloquejat: "Item desbloquejat!",
    ruta_secreta: "Ruta secreta desbloquejada!",
    repas_rapido: "Repàs Ràpid",
    repas_titulo: "Repàs Ràpid - 5 Preguntes",
    tria_personatge: "Tria el teu personatge",
    nom_personatge: "Com et dius?",
    canviar_personatge: "Canviar Personatge",
    biblioteca: "Biblioteca",
    biblioteca_desc: "Tots els personatges disponibles per les teves històries",
    minijoc_titol: "Arma la frase",
    minijoc_desc: "Tria els emojis per formar la frase",
    comprovar: "Comprovar",
    correcte: "Correcte!",
    incorrecte: "No és així. Era:",
    no_prou_monedes: "No tens prou monedes!",
    comprat: "Comprat",
    desbloqueja_ruta: "Amb 3 ítems del capítol {n} desbloqueges la ruta secreta de {ciutat}",
    no_frases_disponibles: "Compra més emojis per desbloquejar frases!"
  }
};

let idioma = localStorage.getItem('cat_idioma') || 'es';
let LANG = LANGS[idioma];

// Personatges jugador
const PERSONATGES_JUGADOR = [
  {id: 'noi', emoji: '👦', nom: 'Noi'},
  {id: 'noia', emoji: '👧', nom: 'Noia'},
  {id: 'home', emoji: '👨', nom: 'Home'},
  {id: 'dona', emoji: '👩', nom: 'Dona'}
];

let estat = {
  monedes: parseInt(localStorage.getItem('cat_monedes')) || 0,
  capitolsCompletats: JSON.parse(localStorage.getItem('cat_completats')) || [],
  objectes: JSON.parse(localStorage.getItem('cat_objectes')) || [],
  rutesDesbloquejades: JSON.parse(localStorage.getItem('cat_rutes')) || [],
  capitols100Counts: JSON.parse(localStorage.getItem('cat_capitols100')) || {},
  stats: {
    seny: parseInt(localStorage.getItem('cat_seny')) || 0,
    rauxa: parseInt(localStorage.getItem('cat_rauxa')) || 0,
    arrel: parseInt(localStorage.getItem('cat_arrel')) || 0,
    obert: parseInt(localStorage.getItem('cat_obert')) || 0
  },
  totem: localStorage.getItem('cat_totem') || 'neutral',
  personatge: JSON.parse(localStorage.getItem('cat_personatge')) || null,
  capitolActual: null,
  pasActual: 0,
  fallades: JSON.parse(localStorage.getItem('cat_fallades')) || [],
  falladesCapitol: 0,
  bloquejat: false,
  compres: JSON.parse(localStorage.getItem('cat_compres')) || [],
  emojisDesbloquejats: JSON.parse(localStorage.getItem('cat_emojis')) || [],
  minijoc: {
    fraseObjectiu: null,
    emojisTriats: [],
    emojisDisponibles: [],
    modo: 'corta'
  }
};

const CAPITOLS = [
  {
    id: "capitol_01_bcn_born",
    nom: "Barcelona - El Born",
    icona: "🏛️",
    desbloquejat: true,
    desc: `Arribes al Born. Si parles bé,\net conviden a vermut 🍷`,
    archivo: "capitol_01_bcn_born.json",
    recompensa_100: {item_id: "camisa_cenguera_barca", ruta: "ruta_rave_port_olympic"}
  },
  {
    id: "capitol_02_girona",
    nom: "Girona - Temps de Flors",
    icona: "⚜️",
    desbloquejat: false,
    desc: "Flors als carrers. Català més lent, més de poble.",
    archivo: "capitol_02_girona.json",
    requereix: "capitol_01_bcn_born",
    recompensa_100: {item_id: "flor_suprema_temps_flors", ruta: "ruta_girona_muralla_viva"}
  },
  {
    id: "capitol_03_fires_valencia",
    nom: "València - Fira de Falles",
    icona: "🔥",
    desbloquejat: false,
    desc: "La fira està encesa. Parla amb la gent i guanya el Fuet del Foc.",
    archivo: "capitol_03_fires_valencia.json",
    requereix: "capitol_02_girona",
    recompensa_100: {item_id: "clau_de_la_lonja", ruta: "ruta_valencia_ciutat_vella"}
  }
];

let ITEMS = {};
let AUDIO_ENCERT = null;
let AUDIO_FALLADA = null;
let CATEGORIES_EMOJI = {};

// --- MÚSICA ---
let audioCtx = false;
let musicaLoop = false;
let melodiaActual = false;

const MELODIAS = {
  gremi: [{freq: 196, dur: 1.5}, {freq: 220, dur: 1.5}, {freq: 196, dur: 3.0}],
  estudio: [{freq: 174, dur: 2.0}, {freq: 196, dur: 2.0}, {freq: 220, dur: 4.0}],
  calma: [{freq: 147, dur: 3.0}, {freq: 165, dur: 3.0}]
};

function vibrar() {
  if (navigator.vibrate) navigator.vibrate(20);
}

function quitarSkinTone(emoji) {
  return emoji.replace(/[\u{1F3FB}-\u{1F3FF}]/u, '');
}

function iniciarMusicaChiptune(nombreMelodia = 'estudio') {
  if (!musicaActivada) return;
  if (melodiaActual === nombreMelodia && musicaLoop) return;
  pararMusica();
  melodiaActual = nombreMelodia;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const notas = MELODIAS[nombreMelodia];
  let tiempo = audioCtx.currentTime;

  function tocarNota(nota) {
    if (nota.freq === 0) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = nota.freq;
    gain.gain.value = 0.001;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(tiempo);
    osc.stop(tiempo + nota.dur);
  }

  function loop() {
    tiempo = audioCtx.currentTime;
    notas.forEach(nota => {
      tocarNota(nota);
      tiempo += nota.dur;
    });
    musicaLoop = setTimeout(loop, notas.reduce((a, b) => a + b.dur, 0) * 1000);
  }
  loop();
}

function pararMusica() {
  if (musicaLoop) clearTimeout(musicaLoop);
  if (audioCtx) audioCtx.close();
  musicaLoop = null;
  melodiaActual = null;
}

function tocarJingleCompletado() {
  if (!musicaActivada) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const notas = [{freq: 523, dur: 0.15}, {freq: 659, dur: 0.15}, {freq: 784, dur: 0.15}, {freq: 1047, dur: 0.4}];
  let tiempo = audioCtx.currentTime;
  notas.forEach(nota => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = nota.freq;
    gain.gain.value = 0.00;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(tiempo);
    osc.stop(tiempo + nota.dur);
    tiempo += nota.dur;
  });
}

// INIT
document.addEventListener('DOMContentLoaded', async () => {
  aplicarIdioma();

  document.body.addEventListener('click', () => {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }, { once: true });

  try {
    const res = await fetch('./data/biblioteca_emojis.json');
    BIBLIOTECA_EMOJIS_BASE = await res.json();
    console.log('Biblioteca cargada:', BIBLIOTECA_EMOJIS_BASE.length, 'emojis');
  } catch(err) {
    console.error('No s\'ha pogut carregar biblioteca_emojis.json', err);
    BIBLIOTECA_EMOJIS_BASE = [];
  }

  try {
    const res = await fetch('./data/minijoc_frases.json');
    const data = await res.json();
    FRASES_MINIJOC = data.frases;
    console.log('Frases minijoc cargadas:', FRASES_MINIJOC.length);
  } catch(err) {
    console.error('No s\'ha pogut carregar minijoc_frases.json', err);
    FRASES_MINIJOC = [];
  }

  try {
    const res = await fetch('./data/frases_mixtas.json');
    const data = await res.json();
    FRASES_MIXTAS = data.frases;
    console.log('Frases mixtas cargadas:', FRASES_MIXTAS.length);
  } catch(err) {
    console.error('No s\'ha pogut carregar frases_mixtas.json', err);
    FRASES_MIXTAS = [];
  }

  try {
    const res = await fetch('./data/categories_emoji.json');
    CATEGORIES_EMOJI = await res.json();
    console.log('Categories cargadas');
  } catch(err) {
    console.error('No s\'ha pogut carregar categories_emoji.json', err);
  }

  NIVELL_MINIJOC.nivelActual = parseInt(localStorage.getItem('cat_nivell_minijoc')) || 1;

  await carregarItems();
  actualitzarUI();
  actualitzarTotem();
  carregarMapa();

  AUDIO_ENCERT = new Audio('data:audio/wav;base64,UklGRiZDAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQIAAAAAAAA=');
  AUDIO_FALLADA = new Audio('data:audio/wav;base64,UklGRiZDAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQIAAAAAAAAA');
});

function aplicarIdioma() {
  document.getElementById('app-titol').textContent = LANG.app_titol;
  document.getElementById('text-monedes').textContent = LANG.monedes;
  document.getElementById('tab-mapa-txt').textContent = LANG.tab_mapa;
  document.getElementById('tab-missio-txt').textContent = LANG.tab_missio;
  document.getElementById('tab-gremi-txt').textContent = LANG.tab_gremi;
  document.getElementById('tab-botiga-txt').textContent = LANG.tab_botiga;
  document.getElementById('text-mon').textContent = LANG.text_mon;
  document.getElementById('text-botiga').textContent = LANG.text_botiga;
}

function canviarTab(tab, e) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  if(e && e.target) e.target.closest('.nav-item').classList.add('active');
  if(tab === 'mapa') {pararMusica(); carregarMapa();}
  if(tab === 'missio') {pararMusica(); carregarMissioTab();}
  if(tab === 'gremi') {iniciarMusicaChiptune('gremi'); mostrarGremi('personatges', e);}
  if(tab === 'botiga') {iniciarMusicaChiptune('estudio'); carregarBotiga();}
}

async function carregarItems() {
  try {
    const res = await fetch('./data/items.json');
    const arr = await res.json();
    ITEMS = {};
    arr.forEach(i => ITEMS[i.id] = i);
  } catch(e) {
    ITEMS = {};
  }
}

//... resto del código de capítulos, mapa, etc... igual que lo tenías

function guardarEstat() {
  localStorage.setItem('cat_monedes', estat.monedes);
  localStorage.setItem('cat_completats', JSON.stringify(estat.capitolsCompletats));
  localStorage.setItem('cat_objectes', JSON.stringify(estat.objectes));
  localStorage.setItem('cat_rutes', JSON.stringify(estat.rutesDesbloquejades));
  localStorage.setItem('cat_capitols100', JSON.stringify(estat.capitols100Counts));
  localStorage.setItem('cat_seny', estat.stats.seny);
  localStorage.setItem('cat_rauxa', estat.stats.rauxa);
  localStorage.setItem('cat_arrel', estat.stats.arrel);
  localStorage.setItem('cat_obert', estat.stats.obert);
  localStorage.setItem('cat_totem', estat.totem);
  localStorage.setItem('cat_fallades', JSON.stringify(estat.fallades));
  localStorage.setItem('cat_personatge', JSON.stringify(estat.personatge));
  localStorage.setItem('cat_compres', JSON.stringify(estat.compres));
  localStorage.setItem('cat_emojis', JSON.stringify(estat.emojisDesbloquejats));
  localStorage.setItem('cat_nivell_minijoc', NIVELL_MINIJOC.nivelActual);
}

function actualitzarUI() {
  document.getElementById('coins').innerHTML = `🪙 ${estat.monedes} <span id="text-monedes">${LANG.monedes}</span>`;
  document.getElementById('stats').textContent = `Seny: ${estat.stats.seny} | Rauxa: ${estat.stats.rauxa} | Arrel: ${estat.stats.arrel} | Obert: ${estat.stats.obert}`;
}

function mostrarGremi(tab, e) {
  document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
  if(e) e.target.classList.add('active');
  const cont = document.getElementById('gremi-contenidor');
  const bibSubtabs = document.getElementById('biblioteca-subtabs');
  cont.innerHTML = '';

  if (tab === 'biblioteca') {
    bibSubtabs.style.display = 'flex';
    mostrarBibliotecaTab('diccionari');
    return;
  } else {
    bibSubtabs.style.display = 'none';
  }

  if(tab === 'personatges') {
    if(!estat.personatge) {
      let html = `<h3 style="text-align:center; margin-bottom:20px;">${LANG.tria_personatge}</h3>`;
      html += `<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:15px; max-width:300px; margin:0 auto;">`;
      PERSONATGES_JUGADOR.forEach(p => {
        html += `<button class="btn" style="font-size:48px; padding:20px;" onclick="seleccionarPersonatge('${p.id}')">${p.emoji}<div style="font-size:14px; margin-top:5px;">${p.nom}</div></button>`;
      });
      html += `</div><div style="margin-top:20px; text-align:center;">
        <input type="text" id="nom-jugador" placeholder="${LANG.nom_personatge}" style="padding:10px; width:80%; border-radius:8px; border:none; background:#2a2a2a; color:#fff;">
      </div>`;
      cont.innerHTML = html;
    } else {
      const emojis = { seny: '🦉', rauxa: '🔥', arrel: '🌳', obert: '🌍', neutral: '😐' };
      const titols = { seny: 'Estratèg', rauxa: 'Impulsiu', arrel: 'Arrelat', obert: 'Cosmopolita', neutral: 'Novell' };
      const totalStats = estat.stats.seny + estat.stats.rauxa + estat.stats.arrel + estat.stats.obert;
      const rang = totalStats < 20? 'Novell' : totalStats < 50? 'Viatjant' : totalStats < 100? 'Mestre' : 'Llegendari';

      cont.innerHTML = `
        <div class="gremi-item" style="grid-column:1/-1; text-align:center;">
          <div style="font-size:64px;">${estat.personatge.emoji}</div>
          <h3 style="margin:10px 0;">${estat.personatge.nom}</h3>
          <p style="color:#888;">${estat.personatge.nom_cat}</p>
          <hr style="border-color:#333; margin:15px 0;">
          <p><b>Rang:</b> ${rang}</p>
          <p><b>Títol:</b> ${titols[estat.totem]}</p>
          <p><b>Capítols 100%:</b> ${estat.capitolsCompletats.length}/${CAPITOLS.length}</p>
          <button class="btn btn-sec" style="margin-top:15px;" onclick="canviarPersonatge()">${LANG.canviar_personatge}</button>
        </div>
      `;
    }
  }

  if(tab === 'objectes') {
    if(estat.objectes.length === 0) {
      cont.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#888;">Encara no tens objectes</div>`;
    } else {
      estat.objectes.forEach(id => {
        const item = ITEMS[id];
        if(item) {
          const esEmoji = item.imatge?.length <= 2 &&!item.imatge.startsWith('./');
          const imgHtml = esEmoji? `<div style="font-size: 60px; margin-bottom: 10px;">${item.imatge}</div>` : `<img src="${item.imatge}" style="width:80px; height:80px; object-fit:contain;">`;
          cont.innerHTML += `<div class="gremi-item">${imgHtml}<div>${item.nom}</div><div style="font-size:12px; color:#888;">${item.descripcio}</div></div>`;
        }
      });
    }
  }

  if(tab === 'llegendes') {
    const llegendes = [
      { id: 'capitol_01_bcn_born', nom: 'El Born, Barcelona', icona: '🏛️', desbloquejada: estat.capitolsCompletats.includes('capitol_01_bcn_born'), text: 'El Born és el barri gòtic més viu.' },
      { id: 'capitol_02_girona', nom: 'Temps de Flors, Girona', icona: '🏰', desbloquejada: estat.capitolsCompletats.includes('capitol_02_girona'), text: 'Cada maig, Girona s\'omple de flors.' },
      { id: 'capitol_03_fires_valencia', nom: 'Falles, València', icona: '🔥', desbloquejada: estat.capitolsCompletats.includes('capitol_03_fires_valencia'), text: 'El foc purifica tot.' }
    ];
    llegendes.forEach(l => {
      if(l.desbloquejada) {
        cont.innerHTML += `<div class="gremi-item" style="grid-column:1/-1;"><div style="font-size:36px;">${l.icona}</div><h3 style="margin:10px 0;">${l.nom}</h3><p style="font-size:14px; color:#ccc;">${l.text}</p><div style="color:#4CAF50; font-size:12px; margin-top:10px;">✓ Desbloquejada</div></div>`;
      } else {
        cont.innerHTML += `<div class="gremi-item" style="grid-column:1/-1; opacity:0.4;"><div style="font-size:36px;">🔒</div><h3 style="margin:10px 0;">???</h3><p style="font-size:14px; color:#666;">Completa el capítol per desbloquejar aquesta llegenda</p></div>`;
      }
    });
  }
}

function mostrarBibliotecaTab(tab, e) {
  document.querySelectorAll('#biblioteca-subtabs.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
  if(e) e.target.classList.add('active');

  const cont = document.getElementById('gremi-contenidor');

  if(tab === 'diccionari') {
    let html = `<h3 style="text-align:center; margin-bottom:10px;">${LANG.biblioteca}</h3>`;
    html += `<p style="text-align:center; color:#888; margin-bottom:20px; font-size:14px;">${LANG.biblioteca_desc}</p>`;
    html += `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; max-height:500px; overflow-y:auto; padding:10px;">`;

    const totsEmojis = [...BIBLIOTECA_EMOJIS_BASE,...estat.emojisDesbloquejats];
    totsEmojis.forEach(p => {
      html += `
        <div class="gremi-item" style="text-align:center; padding:15px 8px;">
          <div style="font-size:42px; margin-bottom:8px;">${p.emoji}</div>
          <div style="font-size:13px; font-weight:600; line-height:1.2;">${p.nom_cat}</div>
        </div>
      `;
    });
    html += `</div>`;
    cont.innerHTML = html;
  }

  if(tab === 'minijocs') {
    cont.innerHTML = `
      <h3>${LANG.minijoc_titol}</h3>
      <p id="minijoc-nivell" style="color:#4CAF50; font-weight:bold; margin:8px 0;">Nivell 1 - 2 emojis</p>
      <p style="color:var(--text-sec); margin:12px 0;">${LANG.minijoc_desc}</p>
      <div id="minijoc-frase" style="background:#222; padding:15px; border-radius:12px; min-height:50px; margin-bottom:15px; text-align:center; font-size:18px;">
        Prem "Nova frase" per començar
      </div>
      <button class="btn btn-sec" onclick="novaFraseMinijoc()" style="margin-bottom:15px;">Nova frase</button>
      <div id="minijoc-emojis" class="emoji-grid"></div>
      <div id="minijoc-triats" style="background:#222; padding:15px; border-radius:12px; min-height:50px; margin:15px 0; text-align:center; font-size:24px;"></div>
      <button class="btn" onclick="comprovarMinijoc()">${LANG.comprovar}</button>
      <div id="minijoc-feedback" style="margin-top:15px;"></div>
    `;
    novaFraseMinijoc();
  }
}

// LÓGICA MINIJUEGO HÍBRIDO CON SKIN TONES
function novaFraseMinijoc() {
  const emojisJugador = [...BIBLIOTECA_EMOJIS_BASE.map(e => e.emoji),...estat.emojisDesbloquejats.map(e => e.emoji)];

  const usarMixta = NIVELL_MINIJOC.nivelActual >= 2 && Math.random() > 0.4;

  if (usarMixta) {
    generarFraseMixta(emojisJugador);
  } else {
    generarFraseCorta(emojisJugador);
  }
}

function generarFraseMixta(emojisJugador) {
  const frasesDisponibles = FRASES_MIXTAS.filter(f =>
    f.nivell <= NIVELL_MINIJOC.nivelActual &&
    f.solucio.every(eSol => emojisJugador.some(eJug => quitarSkinTone(eJug) === quitarSkinTone(eSol)))
  );

  if (frasesDisponibles.length === 0) {
    generarFraseCorta(emojisJugador);
    return;
  }

  const frase = frasesDisponibles[Math.floor(Math.random() * frasesDisponibles.length)];
  estat.minijoc.fraseObjectiu = frase;
  estat.minijoc.emojisTriats = [];
  estat.minijoc.modo = 'mixta';

  document.getElementById('minijoc-frase').textContent = frase.text;
  document.getElementById('minijoc-triats').textContent = '';
  document.getElementById('minijoc-feedback').innerHTML = '';
  document.getElementById('minijoc-nivell').textContent =
    `Nivell ${NIVELL_MINIJOC.nivelActual} - Completa amb ${frase.solucio.length} emoji(s)`;

  const emojisFalsos = emojisJugador
   .filter(e =>!frase.solucio.some(eSol => quitarSkinTone(e) === quitarSkinTone(eSol)))
   .sort(() => 0.5 - Math.random())
   .slice(0, 8 - frase.solucio.length);

  const emojisAMostrar = [...frase.solucio,...emojisFalsos].sort(() => 0.5 - Math.random());
  estat.minijoc.emojisDisponibles = emojisAMostrar;

  let html = '';
  emojisAMostrar.forEach((emoji, i) => {
    const emojiData = BIBLIOTECA_EMOJIS_BASE.find(e => quitarSkinTone(e.emoji) === quitarSkinTone(emoji)) ||
                      estat.emojisDesbloquejats.find(e => quitarSkinTone(e.emoji) === quitarSkinTone(emoji));
    html += `
      <div class="emoji-item" onclick="triarEmojiMinijoc(${i})" style="cursor:pointer;">
        <div class="emoji-large">${emoji}</div>
        <div class="emoji-name">${emojiData?.nom_cat || ''}</div>
      </div>
    `;
  });
  document.getElementById('minijoc-emojis').innerHTML = html;
}

function generarFraseCorta(emojisJugador) {
  const plantillesDisponibles = FRASES_MINIJOC.filter(p =>
    p.nivell <= NIVELL_MINIJOC.nivelActual &&
    p.emojis <= emojisJugador.length
  );

  if (plantillesDisponibles.length === 0) {
    document.getElementById('minijoc-frase').textContent = "Compra més emojis per desbloquejar frases!";
    return;
  }

  const plantilla = plantillesDisponibles[Math.floor(Math.random() * plantillesDisponibles.length)];
  const { text, solucio } = generarFraseDinamica(plantilla, emojisJugador);

  estat.minijoc.fraseObjectiu = { text, solucio };
  estat.minijoc.emojisTriats = [];
  estat.minijoc.modo = 'corta';

  document.getElementById('minijoc-frase').textContent = text;
  document.getElementById('minijoc-triats').textContent = '';
  document.getElementById('minijoc-feedback').innerHTML = '';
  document.getElementById('minijoc-nivell').textContent = `Nivell ${NIVELL_MINIJOC.nivelActual} - ${solucio.length} emojis`;

  generarEmojisParaFraseCorta({solucio});
}

function generarEmojisParaFraseCorta(frase) {
  const emojisJugador = [...BIBLIOTECA_EMOJIS_BASE.map(e => e.emoji),...estat.emojisDesbloquejats.map(e => e.emoji)];
  const emojisFalsos = emojisJugador
   .filter(e =>!frase.solucio.some(eSol => quitarSkinTone(e) === quitarSkinTone(eSol)))
   .sort(() => 0.5 - Math.random())
   .slice(0, 10 - frase.solucio.length);

  const emojisAMostrar = [...frase.solucio,...emojisFalsos].sort(() => 0.5 - Math.random());
  estat.minijoc.emojisDisponibles = emojisAMostrar;

  let html = '';
  emojisAMostrar.forEach((emoji, i) => {
    const emojiData = BIBLIOTECA_EMOJIS_BASE.find(e => quitarSkinTone(e.emoji) === quitarSkinTone(emoji)) ||
                      estat.emojisDesbloquejats.find(e => quitarSkinTone(e.emoji) === quitarSkinTone(emoji));
    html += `
      <div class="emoji-item" onclick="triarEmojiMinijoc(${i})" style="cursor:pointer;">
        <div class="emoji-large">${emoji}</div>
        <div class="emoji-name">${emojiData?.nom_cat || ''}</div>
      </div>
    `;
  });
  document.getElementById('minijoc-emojis').innerHTML = html;
}

function generarFraseDinamica(plantilla, emojisJugador) {
  let text = plantilla.plantilla;
  let solucio = [];

  for (const cat in CATEGORIES_EMOJI) {
    const regex = new RegExp(`\\{${cat}\\}`, 'g');
    if (text.match(regex)) {
      const emojisDisponibles = CATEGORIES_EMOJI[cat].filter(eBase =>
        emojisJugador.some(eJug => quitarSkinTone(eJug) === quitarSkinTone(eBase))
      );

      if (emojisDisponibles.length === 0) {
        return generarFraseDinamica(FRASES_MINIJOC[Math.floor(Math.random() * FRASES_MINIJOC.length)], emojisJugador);
      }

      const emojiElegit = emojisDisponibles[Math.floor(Math.random() * emojisDisponibles.length)];
      text = text.replace(regex, obtenirNomEmoji(emojiElegit));
      solucio.push(emojiElegit);
    }
  }

  return { text, solucio };
}

function obtenirNomEmoji(emoji) {
  const noms = {
    '👨': 'el pare', '👩': 'la mare', '👦': 'el noi', '👧': 'la noia',
    '👴': 'l\'avi', '👵': 'l\'àvia', '🐶': 'el gos', '🐱': 'el gat',
    '🏠': 'casa', '🏫': 'l\'escola', '🌊': 'el mar', '🍞': 'pa',
    '💻': 'ordinador', '🎵': 'música', '🐦': 'ocells', '⭐': 'estrelles',
    '🏥': 'hospital', '⚽': 'futbol'
  };
  return noms[quitarSkinTone(emoji)] || emoji;
}

function triarEmojiMinijoc(index) {
  vibrar();
  const emoji = estat.minijoc.emojisDisponibles[index];
  const maxEmojis = estat.minijoc.fraseObjectiu.solucio.length;

  if (estat.minijoc.emojisTriats.length < maxEmojis) {
    estat.minijoc.emojisTriats.push(emoji);
    actualitzarTriatsMinijoc();
  }
}

function actualitzarTriatsMinijoc() {
  const div = document.getElementById('minijoc-triats');
  const fraseDiv = document.getElementById('minijoc-frase');
  const frase = estat.minijoc.fraseObjectiu;

  if (estat.minijoc.modo === 'mixta') {
    div.textContent = estat.minijoc.emojisTriats.join(' ');
    let fraseMostrada = frase.text;
    estat.minijoc.emojisTriats.forEach(emoji => {
      fraseMostrada = fraseMostrada.replace('___', emoji);
    });
    fraseDiv.textContent = fraseMostrada;
  } else {
    div.textContent = estat.minijoc.emojisTriats.join(' ');
  }
}

function comprovarMinijoc() {
  vibrar();
  const frase = estat.minijoc.fraseObjectiu;

  if (estat.minijoc.modo === 'mixta') {
    const esCorrecte = frase.solucio.every(eSol =>
      estat.minijoc.emojisTriats.some(eTri => quitarSkinTone(eTri) === quitarSkinTone(eSol))
    ) && estat.minijoc.emojisTriats.length === frase.solucio.length;

    const feedback = document.getElementById('minijoc-feedback');
    if (esCorrecte) {
      const fraseCompleta = frase.text.replace('___', frase.solucio[0]);
      feedback.innerHTML = `<p style="color:#4CAF50; font-weight:bold;">${LANG.correcte}<br>${fraseCompleta}</p>`;
      estat.monedes += 50;
      estat.stats.arrel += 5;
      actualitzarUI();
      guardarEstat();
        } else {
      feedback.innerHTML = `<p style="color:#f44336; font-weight:bold;">${LANG.incorrecte} ${frase.solucio.join(' ')}</p>`;
    }
  } else {
    const solucioCorrecta = frase.solucio.map(quitarSkinTone).join('');
    const triatsCorrecte = estat.minijoc.emojisTriats.map(quitarSkinTone).join('');
    const esCorrecte = solucioCorrecta === triatsCorrecte;
    const feedback = document.getElementById('minijoc-feedback');

    if (esCorrecte) {
      feedback.innerHTML = `<p style="color:#4CAF50; font-weight:bold;">${LANG.correcte}</p>`;
      estat.monedes += 50;
      estat.stats.arrel += 5;
      actualitzarUI();
      guardarEstat();
    } else {
      feedback.innerHTML = `<p style="color:#f44336; font-weight:bold;">${LANG.incorrecte} ${frase.solucio.join(' ')}</p>`;
    }
  }

  setTimeout(() => novaFraseMinijoc(), 2000);
}

function seleccionarPersonatge(id) {
  const p = PERSONATGES_JUGADOR.find(x => x.id === id);
  const nomInput = document.getElementById('nom-jugador')?.value.trim();
  estat.personatge = {
    id: p.id,
    emoji: p.emoji,
    nom: nomInput || 'Jugador',
    nom_cat: p.nom
  };
  guardarEstat();
  mostrarGremi('personatges', null);
}

function canviarPersonatge() {
  estat.personatge = null;
  guardarEstat();
  mostrarGremi('personatges', null);
}

async function carregarBotiga() {
  const cont = document.getElementById('botiga-contenidor');
  try {
    const res = await fetch('./data/botiga_emojis.json');
    const data = await res.json();
    estat.packs_botiga = data.packs;
    cont.innerHTML = '';

    data.packs.forEach(pack => {
      const comprat = estat.compres.includes(pack.id);
      const card = document.createElement('div');
      card.className = 'capitol-card';
      card.innerHTML = `
        <div class="capitol-icona">🎁</div>
        <h3>${pack.nom}</h3>
        <p style="color:var(--text-sec); margin:8px 0;">${pack.descripcio}</p>
        <p style="font-size:24px;">${pack.emojis.map(e => e.emoji).join(' ')}</p>
        <button class="btn ${comprat? 'btn-sec' : ''}"
                onclick="comprarPack('${pack.id}', ${pack.preu})"
                ${comprat? 'disabled' : ''}>
          ${comprat? LANG.comprat : `🪙 ${pack.preu}`}
        </button>
      `;
      cont.appendChild(card);
    });
  } catch(e) {
    cont.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#888;">Pròximament</div>';
  }
}

function comprarPack(id, preu) {
  if (estat.monedes < preu) {
    alert(LANG.no_prou_monedes);
    return;
  }

  vibrar();
  estat.monedes -= preu;
  estat.compres.push(id);

  const pack = estat.packs_botiga.find(p => p.id === id);
  estat.emojisDesbloquejats.push(...pack.emojis);

  // Sube nivel al comprar pack para desbloquear frases mixtas
  NIVELL_MINIJOC.nivelActual = Math.min(NIVELL_MINIJOC.nivelActual + 1, NIVELL_MINIJOC.maxEmojis);

  guardarEstat();
  actualitzarUI();
  carregarBotiga();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW error:', err));
}