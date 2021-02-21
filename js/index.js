let now = Date.now();
console.log("script loaded");

let metronome = {
    bpm: 60,
    interval: (1000 * ((1 / 60) * 60)),
    updateBPM: (e) => {
        metronome.bpm = e.target.value;
        metronome.interval = 1000 * ((1 / metronome.bpm) * 60);
    },
    running: undefined,
    muted: false,
    audiofile: new Audio(document.querySelector("#metronome").src),
    timeLastTick: undefined,
    timeNow: undefined,
    tick: () => {
        metronome.timeNow = Date.now();
        if (metronome.timeNow - metronome.timeLastTick >= metronome.interval) {
            metronome.timeLastTick = metronome.timeNow;
            if (!metronome.muted) {
                metronome.audiofile.currentTime = 0;
                metronome.audiofile.play();
            }
            console.log("tick");
        }
        metronome.running = requestAnimationFrame(metronome.tick); 
    },
    start: () => {
        metronome.timeNow = Date.now();
        metronome.timeLastTick = metronome.timeNow;
        metronome.running = requestAnimationFrame(metronome.tick); 
    },
    stop: () => {
        window.cancelAnimationFrame(metronome.running);
        metronome.running = undefined;
    },
    toggle: () => {
        if (metronome.running == undefined) {
            metronome.start();
        }
        else {
            metronome.stop();
        }
    },
    toggleMute: () => {
        metronome.muted = !metronome.muted;
    }
}

const inputField = document.querySelector("#bpmInput");
inputField.addEventListener("input", metronome.updateBPM);

let polyrhythm1 = {
    subdiv: 3,
    running: undefined,
    muted: false,
    onTimeJ: undefined,
    audiofile: new Audio(document.querySelector("#jSound").src),
    tick: () => {
        const interval = (1000 * ((1 / metronome.bpm) / 60)) / polyrhythm1.subdiv;
        if (!polyrhythm1.muted) {
            polyrhythm1.audiofile.play();
        }
        console.log("tick1");
        polyrhythm1.running = setTimeout(polyrhythm1.tick, Math.max(0, polyrhythm1.interval));
    },
    start: () => {
        polyrhythm1.running = setTimeout(polyrhythm1.tick, 0);
    },
    stop: () => {
        clearTimeout(polyrhythm1.running);
    },
    toggleMute: () => {
        polyrhythm1.muted = !polyrhythm1.muted;
    }
}

let polyrhythm2 = {
    subdiv: 2,
    running: undefined,
    muted: false,
    onTimeF: undefined,
    audiofile: new Audio(document.querySelector("#fSound").src),
    tick: () => {
        const interval = (1000 * ((1 / metronome.bpm) / 60)) / polyrhythm2.subdiv;
        if (!polyrhythm2.muted) {
            polyrhythm2.audiofile.play();
        }
        console.log("tick2");
        polyrhythm2.running = setTimeout(polyrhythm2.tick, Math.max(0, polyrhythm2.interval));        
    },
    start: () => {
        polyrhythm2.running = setTimeout(polyrhythm2.tick, 0);
    },
    stop: () => {
        clearTimeout(polyrhythm2.running);
    },
    toggleMute: () => {
        polyrhythm2.muted = !polyrhythm2.muted;
    }
}

// function bpmchange() {
//     metronome.bpm = document.getElementById("bpmInput").value;
// }

function offPercent(press, expected) {
    return (Math.abs(press - expected) / 10); 
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

// let now = Date.now();
document.addEventListener('keydown', (e) => {
    let audio = undefined;
    if (e.keyCode == 74) {
        audio = document.getElementById('jSound');
        // let jPress = now;
        // let offPctJ = offPercent(jPress, polyrhythm1.onTimeJ);
    }
    if (e.keyCode == 70) {
        audio = document.getElementById('fSound');
        // let fPress = now;
        // let offPctF = offPercent(fPress, polyrhythm1.onTimeF);

        /*Average performance summary concept code
        var percent = [];
        percent.push(OffPctJ, OffPctF);
        const arrAvg = percent => percent.reduce((a,b) => a + b, 0) / percent.length
        Something along the lines of this :(
        */
    }
    if (audio != undefined) {
        const audioClip = new Audio(audio.src);
        audioClip.play();
        const key = document.querySelector(`.key[data-key="${e.keyCode}"`);
        key.classList.add("pressed");
    } 
});
document.addEventListener('pointerdown', (e) => {
    let audio;
    if (e.button == 0 && e.target.classList.contains("key")) {
        e.target.classList.add("pressed");
        audio = document.querySelector(`audio[data-key="${e.target.getAttribute("data-key")}"]`);
        const audioClip = new Audio(audio.src);
        audioClip.play();
    }
});
document.addEventListener('keyup', (e) => {
    const key = document.querySelector(`.key[data-key="${e.keyCode}"`);
    if (key != null) {
        key.classList.remove("pressed");
    }
});
document.addEventListener("pointerup", (e) => {
    if (e.button == 0 && e.target.classList.contains("key")) {
        e.target.classList.remove("pressed");
    }
})


metronome.start();