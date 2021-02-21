console.log("script loaded");

//#region Metronome

let metronome = {
    bpm: document.getElementById("bpmInput").value,
    interval: (1000 * ((1 / document.getElementById("bpmInput").value) * 60)),
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
        metronome.timeNow = performance.now();
        if (metronome.timeNow - metronome.timeLastTick >= metronome.interval) {
            metronome.timeLastTick = metronome.timeNow;
            if (!metronome.muted) {
                metronome.audiofile.currentTime = 0;
                metronome.audiofile.play();
            }
        }

        // Polyrhythm time keeping
        for (let i = 0; i < polyrhythmList.length; i++) {
            polyrhythmList[i].interval = metronome.interval / polyrhythmList[i].beats;
            if (metronome.timeNow - metronome.timeLastTick >= polyrhythmList[i].currentBeat*polyrhythmList[i].interval || metronome.timeNow - metronome.timeLastTick == 0) {
                polyrhythmList[i].tick();
            }
        }
        metronome.running = requestAnimationFrame(metronome.tick); 
    },
    start: () => {
        metronome.timeNow = performance.now();
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
//#endregion

//#region Polyrhythms

class Polyrhythm {
    constructor(beats, soundfileID, index) {
        this.visual = document.querySelector(`.beat[data-index="${index}"]`);
        this.currentBeat = 1;
        this.beats = beats;
        this.interval = undefined;
        this.now = performance.now;
        this.muted = false;
        this.audiofile = new Audio(document.querySelector(soundfileID).src);
    }

    tick() {
        if (!this.muted) {
            this.audiofile.currentTime = 0;
            this.audiofile.play();
        }

        // // Beat indicators
        // this.animateVisual({
        //     duration: this.interval, 
        //     timing: this.calcPosition,
        //     update: this.updateVisual
        // });

        this.visual.classList.remove("animatedBall");
        this.visual.style.transform = "translateY(-200px)";
        setTimeout(() => {
            this.visual.style.transform = "translateY(0px)";
            this.visual.classList.add("animatedBall");
        }, 10);

        this.currentBeat = (this.currentBeat % this.beats) + 1;
    }

    //#region this animation crap is broken af
    // updateVisual(position) {
    //     // this.visual.transform = `translateY(${position}px)`;
    //     console.log(this.visual);
    // }

    // calcPosition(percentage) {
    //     // 0-1 maps to -200px to 0px
    //     return 200 - (percentage * 200);
    // }

    // animateVisual({duration, timing, update}) {
    //     let animStartTime = performance.now();
    //     // console.log(this.updateVisual(1));
    //     requestAnimationFrame(function animateVisual(time) {
    //         let animPercentage = (time - animStartTime) / duration;
    //         if (animPercentage > 1) {
    //             animPercentage = 1;
    //         }

    //         let mappedTime = timing(animPercentage);
    //         // this.updateVisual(mappedTime);
    //         update(mappedTime);
    //         // this.updateVisual()

    //         // let mappedTime = this.calcPosition(animPercentage);

    //         if (animPercentage < 1) {
    //             requestAnimationFrame(lerp);
    //         }
    //     });
    // }
    // //#endregion
}

// Mute toggle
function toggleMutePolyrhythm(index) {
    polyrhythmList[index].muted = !polyrhythmList[index].muted;
}

//#endregion

//#region Button event listeners

    //#region Beat buttons

    document.addEventListener('keydown', (e) => {
        let audio = undefined;
        if (e.keyCode == 74) {
            audio = document.getElementById('jSound');
        }
        if (e.keyCode == 70) {
            audio = document.getElementById('fSound');
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
    });

    //#endregion

    //#region Beat changing
    
    // Hardcoded, modularize some time later to support addition of more than 2 rhythms
    const poly1 = document.getElementById("poly1Input");
    const poly2 = document.getElementById("poly2Input");

    poly1.addEventListener("input", (e) => {
        polyrhythmList[0].beats = e.target.value;
    });
    poly2.addEventListener("input", (e) => {
        polyrhythmList[1].beats = e.target.value;
    });

    //#endregion

//#endregion

const polyrhythmList = [new Polyrhythm(poly1.value, "#fSound", 0), new Polyrhythm(poly2.value, "#jSound", 1)];
metronome.start();