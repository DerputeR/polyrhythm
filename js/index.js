let now = new Date;
var milli = now.getMilliseconds();

let metronome = {
    
    bpm: 60,
    running: undefined,
    muted: false,
    audiofile: new Audio(document.querySelector("#metronome").src),
    tick: () => {
        const interval = 1000 * ((1 / metronome.bpm) * 60);
        if (!metronome.muted) {
            metronome.audiofile.currentTime = 0;
            metronome.audiofile.play();
        }
        console.log("tick");
        metronome.running = setTimeout(metronome.tick, Math.max(0, interval));
        
    },
    start: () => {
        metronome.running = setTimeout(metronome.tick, 0);
    },
    stop: () => {
        clearTimeout(metronome.running);
    }
}

const inputField = document.querySelector("#bpmInput");
inputField.addEventListener("input", bpmchange);

let polyrhythm1 = {
    subdiv: 3,
    running: undefined,
    muted: false,
    audiofile: new Audio(document.querySelector("#jSound").src),
    tick: () => {
        const interval = (1000 * ((1 / metronome.bpm) / 60)) / polyrhythm1.subdiv;
        if (!polyrhythm1.muted) {
            polyrhythm1.audiofile.play();
        }
        console.log("tick1");
        polyrhythm1.running = setTimeout(polyrhythm1.tick, Math.max(0, interval));
        
    },
    start: () => {
        polyrhythm1.running = setTimeout(polyrhythm1.tick, 0);
    },
    stop: () => {
        clearTimeout(polyrhythm1.running);
    }
}

let polyrhythm2 = {
    subdiv: 2,
    running: undefined,
    muted: false,
    audiofile: new Audio(document.querySelector("#fsound").src),
    tick: () => {
        const interval = (1000 * ((1 / metronome.bpm) / 60)) / polyrhythm2.subdiv;
        if (!polyrhythm2.muted) {
            polyrhythm2.audiofile.play();
        }
        console.log("tick2");
        polyrhythm2.running = setTimeout(polyrhythm2.tick, Math.max(0, interval));
        
    },
    start: () => {
        polyrhythm2.running = setTimeout(polyrhythm2.tick, 0);
    },
    stop: () => {
        clearTimeout(polyrhythm2.running);
    }
}

function bpmchange() {
    metronome.bpm = document.getElementById("bpmInput").value;
}

// function metronome() {
//     const interval = 1000 * (bpm / 60);
//     const now = new Date();
//     const a = document.getElementById('metronome');
//     const audioClip = new Audio(a.src);
//     console.log("tick");
//     running = setTimeout(metronome, Math.max(0, interval));
//     audioClip.play();
// }

// function startMetronome() {
//     running = setTimeout(metronome, 0);
// }

// function stopMetronome() {
//     clearTimeout(running);
// }
