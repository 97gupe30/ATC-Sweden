var companies = ['NAX', 'BAW', 'EZY', 'SAS', 'KLM'];
var aircrafts = [new Aircraft(100, 100, '', 5000, 0)];

function init() {
    game = document.getElementById('camera');
    ctx = game.getContext('2d');
    
    window.setInterval(moveAircrafts, 1500);
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
    this.hdgSelect = function() {
        ctx.arc(640, 360, 300, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

var menu = new Menu();



function calculate(event) {
    var x = event.x;
    var y = event.y;
    x -= game.offsetLeft;
    y -= game.offsetTop;
    var dx = 640 - x;
    var dy = y - 360;
    console.log(dx);
    console.log(dy);
    
}

function moveAircrafts() {
    ctx.clearRect(0, 0, 1280, 720);
    for(var i = 0; i < aircrafts.length; i++) {
        aircrafts[i].render();
        aircrafts[i].update();
    }
    menu.hdgSelect();
    
}