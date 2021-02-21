

let now = Date.now();
var arrAvg = null;
document.addEventListener('keydown', (e) => {
    let audio = undefined;
    if (e.keyCode == 74) {
        audio = document.getElementById('jSound');
        let jPress = now;
        let offPctJ = offPercent(jPress, expJ);
    }
    if (e.keyCode == 70) {
        audio = document.getElementById('fSound');
        let fPress = now;
        let offPctF = offPercent(fPress, expF);


    var percent = [];
    percent.push(offPctJ, offPctF);
    arrAvg = percent => percent.reduce((a,b) => a + b, 0) / percent.length;
    console.log(arrAvg);
        
    }
    if (audio != undefined) {
        const audioClip = new Audio(audio.src);
        audioClip.play();
        const key = document.querySelector(`.key[data-key="${e.keyCode}"`);
        key.classList.add("pressed");
    } 
});

function clearArray() {
    percent = [];
    arrAvg = 0;
}