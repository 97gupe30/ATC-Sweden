var aircraftCount = 0;
var companies = ['NAX', 'BAW', 'EZY', 'SAS', 'KLM'];
var aircrafts = [new Aircraft(100, 100, '', 5000, 2, aircraftCount), new Aircraft(150, 120, '', 8000, -6, (aircraftCount + 1))];
aircraftCount++;

var vinkel, x, y;
var menu = new Menu();

function init() {
    game = document.getElementById('camera');
    ctx = game.getContext('2d');


    calculate(event);
    window.setInterval(update, 20);
    window.setInterval(moveAircrafts, 1500);
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

function Aircraft(x, y, hdg, altitude, speed, id) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.trueSpeed = Math.abs(speed) * 60;
    this.vx = speed;
    this.vy = speed;
    this.hdg = hdg;
    this.altitude = altitude;
    this.id = id;
    this.activeMenu = 'none';

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
        ctx.arc(aircrafts[i].x + 5, aircrafts[i].y + 5, 100, 0, 2 * Math.PI); // HÄR SKA DU FIXA NU!
        ctx.stroke();
    }
}

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
            aircrafts[i].hdg = vinkel;
        }
    }

}


function mouseClick(event) {  
    var rect = game.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    for(var i = 0; i < aircrafts.length; i++) {
        if(aircrafts[i].activeMenu == 'hdgSelect') { // Funkar just nu. Fixa så den åker via grader istället mot musen.
            calculate(event);
            var v = vinkel * Math.PI / 180;
            var vx = Math.abs(aircrafts[i].speed) * Math.sin(v);
            var vy = Math.abs(aircrafts[i].speed) * Math.cos(v);
            aircrafts[i].vx = vx;
            aircrafts[i].vy = vy;
            console.log(vy, vx);
        }
    }

    var test = true;
    for(var i = 0; i < aircrafts.length; i++) {
        if(aircrafts[i].activeMenu == 'hdgSelect') {
            test = false;
            i = aircrafts[i].length + 1;
        }
    }

    for(var i = 0; i < aircrafts.length; i++) {
        if(mouseX >= aircrafts[i].x && mouseX <= aircrafts[i].x + 5 && mouseY >= aircrafts[i].y && mouseY <= aircrafts[i].y + 5 && test) {
            aircrafts[i].activeMenu = 'hdgSelect';
        }
    }
}

function update() {
    ctx.clearRect(0, 0, 1280, 720);
    for(var i = 0; i < aircrafts.length; i++) {
        var height;
        if(aircrafts[i].altitude >= 7000) {
            height = "FL" + (aircrafts[i].altitude / 100);
        } else {
            height = aircrafts[i].altitude + "ft";
        }

        aircrafts[i].render();
        ctx.font = "10px Arial";
        ctx.fillText(height, aircrafts[i].x + 15, aircrafts[i].y + 15);
        ctx.fillText(aircrafts[i].trueSpeed + "kt", aircrafts[i].x - 15, aircrafts[i].y + 15);


        if(aircrafts[i].activeMenu == 'hdgSelect') {
            menu.hdgSelect(i);
            ctx.font="15px Georgia";
            ctx.fillText(vinkel, aircrafts[i].x + 100 * Math.cos(vinkel * Math.PI / 180 - (Math.PI/2)), aircrafts[i].y + 100 * Math.sin(vinkel * Math.PI / 180 - (Math.PI/2)));
        }
    }
}

function moveAircrafts() {
    for(var i = 0; i < aircrafts.length; i++) {
        aircrafts[i].update();
    }
}