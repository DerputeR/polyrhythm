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
        // Metronome time keeping
        metronome.timeNow = Date.now();
        if (metronome.timeNow - metronome.timeLastTick >= metronome.interval) {
            metronome.timeLastTick = metronome.timeNow;
            if (!metronome.muted) {
                metronome.audiofile.currentTime = 0;
                metronome.audiofile.play();
            }
            // console.log("metronome ticked");
        }

        // Polyrhythm time keeping
        for (let i = 0; i < polyrhythmList.length; i++) {
            const interval = polyrhythmList[i].currentBeat * (metronome.interval / polyrhythmList[i].beats);
            if (metronome.timeNow - metronome.timeLastTick >= interval || metronome.timeNow - metronome.timeLastTick == 0) {
                // console.log(`Current: ${metronome.timeNow}, Last: ${metronome.timeLastTick}, Diff: ${metronome.timeNow - metronome.timeLastTick}, Expected diff: ${polyrhythmList[i].currentBeat * (metronome.interval / polyrhythmList[i].beats)}`);
                polyrhythmList[i].tick();
            }
            // console.log(`Current: ${metronome.timeNow}, Last: ${metronome.timeLastTick}, Diff: ${metronome.timeNow - metronome.timeLastTick}, Expected diff: ${polyrhythmList[i].currentBeat * (metronome.interval / polyrhythmList[i].beats)}`);
            // console.log(polyrhythmList[i].currentBeat);
        }
        metronome.running = requestAnimationFrame(metronome.tick); 
        // console.log(`Current: ${metronome.timeNow}, Last: ${metronome.timeLastTick}`);
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


class Polyrhythm {
    constructor(beats, soundfileID) {
        this.currentBeat = 1;
        this.beats = beats;
        this.now = Date.now;
        this.muted = false;
        this.audiofile = new Audio(document.querySelector(soundfileID).src);
    }

    tick(downbeat) {
        if (!this.muted) {
            this.audiofile.currentTime = 0;
            this.audiofile.play();
        }
        this.currentBeat = (this.currentBeat % this.beats) + 1;
        // console.log(this + "ticked");
    }
}

function toggleMutePolyrhythm(index) {
    polyrhythmList[index].muted = !polyrhythmList[index].muted;
}

const poly1 = document.getElementById("poly1Input");
const poly2 = document.getElementById("poly2Input");

poly1.addEventListener("input", (e) => {
    polyrhythmList[0].beats = e.target.value;
});
poly2.addEventListener("input", (e) => {
    polyrhythmList[1].beats = e.target.value;
});


const polyrhythmList = [new Polyrhythm(poly1.value, "#fSound"), new Polyrhythm(poly2.value, "#jSound")];

// const userBpm = document.getElementById("bpmInput");

metronome.bpm = document.getElementById("bpmInput").value;


function offPercent(press, expected) {
    return (Math.abs(press - expected) / 10); 
}

// let now = Date.now();
document.addEventListener('keydown', (e) => {
    let audio = undefined;
    if (e.keyCode == 74) {
        audio = document.getElementById('jSound');
        let jPress = now;
        let offPctJ = offPercent(jPress, polyrhythm1.onTimeJ);
    }
    if (e.keyCode == 70) {
        audio = document.getElementById('fSound');
        let fPress = now;
        let offPctF = offPercent(fPress, polyrhythm1.onTimeF);

    /*Average performance summary concept code
    var percent = [];
    percent.push(OffPctJ, OffPctF);
    const arrAvg = percent => percent.reduce((a,b) => a + b, 0) / percent.length
    Something along the lines of this :( */
        
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