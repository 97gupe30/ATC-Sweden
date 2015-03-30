var aircraftCount = 0;
var companies = ['NAX', 'BAW', 'EZY', 'SAS', 'KLM'];
var aircrafts = [new Aircraft(100, 100, '', 8000, 2, aircraftCount), new Aircraft(150, 120, '', 8000, 6, (aircraftCount + 1))];
var waypoints = [new WayPoint(200, 100, 10, 'GOLUM', 'Jonathan'),
                 new WayPoint(300, 400, 10, 'Jonathan', 'df')];
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
    event.preventDefault();
    var key = event.keyCode;
    if(key == 27) {
        for(var i = 0; i < aircrafts.length; i++) {
            aircrafts[i].activeMenu = 'none';
        }
    }
    for(var i = 0; i < aircrafts.length; i++) {

        if(aircrafts[i].activeMenu == 'hdgSelect') {
            if(key == 38 && aircrafts[i].tempAlt < 41000 && aircrafts[i].tempAlt >= 0) {
                aircrafts[i].tempAlt += 1000;
            } else if(key == 40 && aircrafts[i].tempAlt > 0 && aircrafts[i].tempAlt <= 41000) {
                aircrafts[i].tempAlt -= 1000;
            } else if(key == 39 && aircrafts[i].tempSpeed < 450 && aircrafts[i].tempSpeed >= 0) {
                aircrafts[i].tempSpeed += 10;
            } else if(key == 37 && aircrafts[i].tempSpeed > 0 && aircrafts[i].tempSpeed <= 450) {
                aircrafts[i].tempSpeed -= 10;
            } else if(key == 13) {
                aircrafts[i].finalAlt = aircrafts[i].tempAlt;
                aircrafts[i].finalSpeed = aircrafts[i].tempSpeed;
            }
        }
    }
}

function WayPoint(x, y, w, name, next) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.name = name;
    this.nextWaypoint = next;

    this.render = function() {
        ctx.font = "10px Arial";
        ctx.strokeRect(this.x, this.y, this.w, this.w);
        ctx.strokeRect(this.x + 3, this.y + 3, this.w - 6, this.w - 6);
        ctx.fillText(this.name.toUpperCase(), this.x - this.name.length * 5 / 2, this.y + 20);
    }

}

function Aircraft(x, y, hdg, altitude, speed, id) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.trueSpeed = Math.abs(speed) * 60;
    this.accSpeed = Math.random() * 7 // Hur snabbt planet accelererar
    while(this.accSpeed < 1 || this.accSpeed > 6) {
        this.accSpeed = Math.random() * 5
    }
    this.finalSpeed = this.trueSpeed;
    this.tempSpeed = this.trueSpeed;
    this.vSpeed = Math.random() * 4000;
    while(this.vSpeed < 1200 || this.vSpeed > 2800) {
        this.vSpeed = Math.random() * 3000;
    }
    this.altitude = altitude;
    this.finalAlt = this.altitude;
    this.tempAlt = this.altitude;
    this.vx = speed;
    this.vy = speed;
    this.hdg = hdg;
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

        // Denna delen av koden kollar om planet ska descenda, climba, accelerera eller deaccelerera och gör det isåfall.
        if(this.finalAlt < this.altitude) { // Descend eller climb
            this.altitude -= (this.vSpeed / 3000);
            if(this.altitude < this.finalAlt) 
                this.altitude = this.finalAlt;
        } else if(this.finalAlt > this.altitude) {
            this.altitude += (this.vSpeed / 3000);
            if(this.altitude > this.finalAlt)
                this.altitude = this.finalAlt;
        }
        if(this.finalSpeed < this.trueSpeed) {
            this.speed -= (this.accSpeed / 3000);
        } else if(this.finalSpeed > this.trueSpeed) {
            this.speed += (this.accSpeed / 3000);
        }
        this.trueSpeed = Math.abs(this.speed) * 60;
        this.vx = Math.abs(this.speed) * Math.sin(this.hdg);
        this.vy = Math.abs(this.speed) * Math.cos(this.hdg);
    }

    this.update = function() {
        this.x += this.vx;
        this.y -= this.vy;
    }

}

function Menu() {
    this.hdgSelect = function(i) {
        ctx.arc(aircrafts[i].x + 5, aircrafts[i].y + 5, 100, 0, 2 * Math.PI);
        ctx.strokeRect(aircrafts[i].x - 110, aircrafts[i].y - 70, 10, 150);
        ctx.fillRect(aircrafts[i].x - 110, aircrafts[i].y + 80, 10, -aircrafts[i].tempAlt / 274);
        ctx.strokeRect(aircrafts[i].x - 70, aircrafts[i].y + 110, 150, 10);
        ctx.fillRect(aircrafts[i].x - 70, aircrafts[i].y + 110, aircrafts[i].tempSpeed / 3.01, 10);
        ctx.stroke();

        var altX = aircrafts[i].x - 135;
        if( aircrafts[i].tempAlt / 100 >= 100)
            altX -= 6;
        ctx.fillText("FL" + aircrafts[i].tempAlt / 100, altX, aircrafts[i].y - aircrafts[i].tempAlt / 300 + 83);
        ctx.fillText(aircrafts[i].tempSpeed + "kt", aircrafts[i].x + aircrafts[i].tempSpeed / 3 - 70, aircrafts[i].y + 130);
    }
}

function calculate(event) {
    for(var i = 0; i < aircrafts.length; i++) {
        if(aircrafts[i].activeMenu == 'hdgSelect') {
            var rect = game.getBoundingClientRect();
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
            var dx = aircrafts[i].x + 2.5 - x;
            var dy = y - aircrafts[i].y - 2.5;
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
    for(var i = 0; i < aircrafts.length; i++) {
        if(aircrafts[i].activeMenu == 'hdgSelect') { // Funkar just nu. Fixa så den åker via grader istället mot musen.
            calculate(event);
            var v = vinkel * Math.PI / 180;
            var vx = Math.abs(aircrafts[i].speed) * Math.sin(v);
            var vy = Math.abs(aircrafts[i].speed) * Math.cos(v);
            aircrafts[i].vx = vx;
            aircrafts[i].vy = vy;
            aircrafts[i].hdg = v;
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

function crashDetect() {
    for(var i = 0; i < aircrafts.length; i++) {
        for(var j = 0; j < aircrafts.length; j++) {
            if(j != i) {
                if(aircrafts[i].x >= aircrafts[j].x && aircrafts[i].x <= aircrafts[j].x + 5 && aircrafts[i].y >= aircrafts[j].y && aircrafts[i].y <= aircrafts[j].y + 5 ||
                   aircrafts[i].x + 5 >= aircrafts[j].x && aircrafts[i].x + 5 <= aircrafts[j].x + 5 && aircrafts[i].y >= aircrafts[j].y && aircrafts[i].y <= aircrafts[j].y + 5 ||
                   aircrafts[i].x >= aircrafts[j].x && aircrafts[i].x <= aircrafts[j].x + 5 && aircrafts[i].y + 5 >= aircrafts[j].y && aircrafts[i].y + 5 <= aircrafts[j].y + 5 ||
                   aircrafts[i].x + 5 >= aircrafts[j].x && aircrafts[i].x + 5 <= aircrafts[j].x + 5 && aircrafts[i].y + 5 >= aircrafts[j].y && aircrafts[i].y + 5 <= aircrafts[j].y + 5) {
                    if(aircrafts[i].altitude >= aircrafts[j].altitude - 100 && aircrafts[i].altitude <= aircrafts[j].altitude + 100) {
                        console.log("CRASH");
                    }
                }
            }
        }
    }
    
    for(var i = 0; i < aircrafts.length; i++) {
        for(var j = 0; j < waypoints.length; j++) {
            if(aircrafts[i].x >= waypoints[j].x && aircrafts[i].x <= waypoints[j].x + waypoints[j].w && aircrafts[i].y >= waypoints[j].y && aircrafts[i].y <= waypoints[j].y + waypoints[j].w) {
                console.log("WAYPOINT");
            }
        }
    }
}

function update() {
    ctx.clearRect(0, 0, 1280, 720);
    crashDetect();
    for(var i = 0; i < waypoints.length; i++) {
        waypoints[i].render();
    }

    for(var i = 0; i < aircrafts.length; i++) {
        aircrafts[i].trueSpeed = Math.abs(aircrafts[i].speed) * 60;

        var height;
        if(aircrafts[i].altitude >= 7000) {
            height = "FL" + Math.round(aircrafts[i].altitude / 100);
        } else {
            height = Math.round(aircrafts[i].altitude) + "ft";
        }

        aircrafts[i].render();
        ctx.font = "10px Arial";
        ctx.fillText(height, aircrafts[i].x + 15, aircrafts[i].y + 15);
        ctx.fillText(Math.round(aircrafts[i].trueSpeed) + "kt", aircrafts[i].x - 15, aircrafts[i].y + 15);


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