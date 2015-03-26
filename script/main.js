var aircraftCount = 0;
var companies = ['NAX', 'BAW', 'EZY', 'SAS', 'KLM'];
var aircrafts = [new Aircraft(100, 100, '', 5000, aircraftCount)];
aircraftCount++;

var vinkel, x, y;

function init() {
    game = document.getElementById('camera');
    ctx = game.getContext('2d');


    calculate(event, 0);
    window.setInterval(moveAircrafts, 1500);
    window.setInterval(update, 20);
    game.addEventListener("mousedown", mouseClick, false);
}

function keyHandler(event) {
    var key = event.keyCode;
    if(key == 27) {
        for(var i = 0; i < aircrafts.length; i++) {
            aircrafts[i].activeMenu = 'none';
        }
    }
}

function Aircraft(x, y, hdg, altitude, id) {
    this.callsignGen = function() {
        var random = Math.round(Math.random() * companies.length);
        if(random = companies.length)
            random--;
        var company = companies[random];
        var length = 8 - company.length;
        random = Math.round(Math.random() * length);
        if(random <= 1)
            random = 2;
        var callsign = "";
        for(var i = 0; i < random; i++) {
            var random2 = Math.round(Math.random() * 9);
            callsign = callsign + random2;
        }
        callsign = company + callsign;
        return callsign;
    }

    this.x = x;
    this.y = y;
    this.vx = 1;
    this.vy = 1;
    this.hdg = hdg;
    this.altitude = altitude;
    this.id = id;
    this.activeMenu = 'none';
    this.callsign = this.callsignGen();

    this.render = function() {
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, 5, 5);
        ctx.closePath();
    }

    this.update = function() {
        this.x += this.vx;
        this.y -= this.vy;
    }

}

function Menu() {
    this.activeMenu = 'none';
    this.hdgSelect = function(i) {
        ctx.arc(aircrafts[i].x, aircrafts[i].y, 200, 0, 2 * Math.PI); // HÄR SKA DU FIXA NU!
        ctx.stroke();
    }
}

var menu = new Menu();



function calculate(event) {
    for(var i = 0; i < aircrafts.length; i++) {
        if(aircrafts[i].activeMenu == 'hdgSelect') {
            var rect = game.getBoundingClientRect();
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
            var dx = aircrafts[i].x + 5 - x;
            var dy = y - aircrafts[i].y + 5;
            vinkel = Math.round(Math.atan(dx / dy) * (180/Math.PI));
            if(dx <= 0 && dy >= 0) {
                vinkel += 180;
            } else if(dx >= 0 && dy >= 0) {
                vinkel += 180;
            } else if(dx >= 0 & dy <= 0) {
                vinkel += 360;
            }
            if(vinkel < 0) {
                vinkel = Math.abs(vinkel);
            }
        }
    }

}


function mouseClick(event) {  
    var rect = game.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    calculate(event);
    for(var i = 0; i < aircrafts.length; i++) {
        if(aircrafts[i].activeMenu == 'hdgSelect') {
            var vx = aircrafts[i].vx * Math.sin(vinkel); // REDIGERA HÄR
            var vy = aircraftCount[i].vy * Math.cos(vinkel);
            console.log(vy, vx);
        }
    }

    for(var i = 0; i < aircrafts.length; i++) {
        if(mouseX >= aircrafts[i].x && mouseX <= aircrafts[i].x + 5 && mouseY >= aircrafts[i].y && mouseY <= aircrafts[i].y + 5) {
            aircrafts[i].activeMenu = 'hdgSelect';
        }
    }


}

function update() {
    ctx.clearRect(0, 0, 1280, 720);
    for(var i = 0; i < aircrafts.length; i++) {
        aircrafts[i].render();
        if(aircrafts[i].activeMenu == 'hdgSelect') {
            menu.hdgSelect(i);
            ctx.font="20px Georgia";
            ctx.fillText(vinkel, x, y);
        }
    }
    if(menu.activeMenu == 'hdgSelect') {

    }
}

function moveAircrafts() {
    for(var i = 0; i < aircrafts.length; i++) {
        aircrafts[i].update();
    }

}