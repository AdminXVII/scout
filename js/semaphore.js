var brasD = document.getElementById('brasD');
var brasG = document.getElementById('brasG');
var out = document.getElementById("out");

var isPrevNum;
function l2br(idx,isNum=false){
    var conv = [[1,0],[2,0],[3,0],[4,0],[0,-3],[0,-2],[0,-1],[1,2],[1,3],[-3,-1],[1,4],[1,-3],[1,-2],[1,-1],[2,3],[2,4],[2,-3],[2,-2],[2,-1],[3,4],[3,-3],[4,-1],[-3,-2],[-3,-1],[3,-2],[-2,-1]];
    var ret = [];
    if (isNum != isPrevNum) {
        isPrevNum = isNum;
        ret.push([4,5]);
    }
    if (isNum && idx !== 0){
        ret.push(conv[idx-1]);
    } else if (isNum) {
        ret.push([-3,-1]);
    } else {
        ret.push(conv[idx]);
    }
    return ret;
}

function clearTimeouts(){
    while(timeouts.length){
        clearTimeout(timeouts.pop());
    }
}

var timeouts = [];

function setBras(bras,delay,delayRestart){
    timeouts.push(setTimeout(function() {
        brasD.setAttribute('transform','rotate('+45*bras[0]+',412,625)');
        brasG.setAttribute('transform','rotate('+45*bras[1]+',517,628)');
    }, delay));
    timeouts.push(setTimeout(function() {
        brasD.setAttribute('transform','rotate(0,412,625)');
        brasG.setAttribute('transform','rotate(0,517,628)');
    }, delay + delayRestart));
}

function phrase(phrase,deltaDelay){
    isPrevNum = false;
    var codes = [];
    phrase = phrase.toLowerCase();
    for (var i = 0; i < phrase.length; i++) {
        idx = phrase.charCodeAt(i);
        if (idx >= 97 && idx < 123){
            codes.push.apply(codes, l2br(idx - 97));
        } else if (idx >= 48 && idx < 58) {
            codes.push.apply(codes, l2br(idx - 48, isNum=true));
        } else {
            codes.push([0, 0]);
        }
    }
    brasG.style.transition = deltaDelay/4+"ms";
    brasD.style.transition = deltaDelay/4+"ms";
    var delay = 0
    for (; codes.length > 0;) {
        bras = codes.shift();
        setBras(bras,delay,deltaDelay*0.75);
        delay += deltaDelay;
    }
}

var text = "42";
function phraseAlea(){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "/scout/rand-str.php", true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            text = JSON.parse(rawFile.responseText);
            vitesse = parseInt(document.getElementById("vitesse").value);
            document.getElementById("phase1").style.display = "none";
            document.getElementById("phase2").style.display = "block";
            deltaDelay = 60000/vitesse;
            phrase(text,deltaDelay)
        }
    }
    rawFile.send(null);
}

function verifier(){
    if (text.toLowerCase() === document.getElementById('texte').value.toLowerCase()){
        out.innerHTML = 'Bravo!! Essayez avec la dificulte plus elevee';
        out.style.color = "green";
    } else {
        out.innerHTML = "poin poin poin. T'es mauvais. Le texte etait: "+text;
        out.style.color = "red";
    }
    document.getElementsByClassName("modal")[0].style.display = "block";
    document.getElementById("phase1").style.display = "block";
    document.getElementById("phase2").style.display = "none";
    clearTimeouts();
}