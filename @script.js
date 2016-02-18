var Maths;
(function (Maths) {
    var Vector2 = (function () {
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Vector2.prototype, "abs", {
            get: function () {
                return Maths.pythagoras(this.x, this.y);
            },
            enumerable: true,
            configurable: true
        });
        return Vector2;
    })();
    Maths.Vector2 = Vector2;
})(Maths || (Maths = {}));
var FileSplash;
(function (FileSplash) {
    var myCanvas = document.createElement("canvas");
    myCanvas.id = "drag-drop-canvas";
    myCanvas.className = "indubitebly-hidden";
    document.body.appendChild(myCanvas);
    var myCover = document.createElement("div");
    myCover.id = "drag-drop";
    myCover.className = "indubitebly-hidden";
    var myCoverText = document.createElement("div");
    myCoverText.id = "drag-drop-text";
    myCoverText.innerText = "drop your file(s) here";
    myCover.appendChild(myCoverText);
    document.body.appendChild(myCover);
    var RealFile = (function () {
        function RealFile(name, text) {
            this.name = name;
            this.text = text;
        }
        return RealFile;
    })();
    FileSplash.RealFile = RealFile;
    var DropCanvas = (function () {
        function DropCanvas() {
            this.realFiles = [];
            this.onStopFuncs = [];
            this.maxSplashTime = 200;
            this.running = false;
            this.dropped = false;
            this.splashed = false;
            this.splashCounter = 0;
            this.finished = false;
            this.segmentSize = 15;
            this.springs = [];
            this.files = [];
            this.droplets = [];
            this.splashTime = 0;
        }
        Object.defineProperty(DropCanvas, "Instance", {
            get: function () {
                if (!DropCanvas._instance) {
                    DropCanvas._instance = new DropCanvas();
                }
                return DropCanvas._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DropCanvas.prototype, "canvas", {
            get: function () {
                if (!this._canvas) {
                    this._canvas = document.getElementById("drag-drop-canvas");
                }
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DropCanvas.prototype, "ctx", {
            get: function () {
                if (!this._ctx) {
                    this._ctx = this.canvas.getContext("2d");
                }
                return this._ctx;
            },
            enumerable: true,
            configurable: true
        });
        DropCanvas.prototype.start = function () {
            if (this.running == true) {
                return;
            }
            this.running = true;
            this.dropped = false;
            this.splashed = false;
            this.splashCounter = 0;
            this.finished = false;
            FileSplash.FrontEnd.showID("drag-drop");
            FileSplash.FrontEnd.showID("drag-drop-canvas");
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.canvas.height = this.canvas.parentElement.clientHeight;
            var segments = Math.floor(this.canvas.width / this.segmentSize);
            this.springs = [];
            this.files = [];
            this.droplets = [];
            this.springBaseSize = this.canvas.height / 6;
            for (var i = 0; i <= segments + 1; i++) {
                this.springs.push(new FileSplash.Spring(i * this.segmentSize, this.springBaseSize, this.canvas.height, i));
            }
            var self = this;
            this.draw(self);
        };
        DropCanvas.prototype.draw = function (self) {
            if (self.running == false) {
                FileSplash.FrontEnd.hideID("drag-drop");
                FileSplash.FrontEnd.hideID("drag-drop-canvas");
                return;
            }
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            var splashes = FileSplash.updateFiles(self.files, self.springs, self.canvas.height - self.springBaseSize);
            for (var i = 0; i < splashes.length; i++) {
                self.splash(splashes[i].index, splashes[i].strength);
            }
            var newFiles = [];
            for (var i = 0; i < self.files.length; i++) {
                if (self.files[i].y < self.canvas.height) {
                    newFiles.push(self.files[i]);
                }
                else {
                    self.splashed = true;
                }
            }
            if (self.splashed == true) {
                self.splashCounter++;
                if (self.splashCounter > self.maxSplashTime) {
                    self.finished = true;
                    self.stop();
                }
            }
            self.files = newFiles;
            FileSplash.drawFiles(self.files, self.ctx);
            var newDroplets = [];
            for (var i = 0; i < self.droplets.length; i++) {
                self.droplets[i].update();
                self.droplets[i].draw(self.ctx);
                if (self.droplets[i].position.y < self.canvas.height) {
                    newDroplets.push(self.droplets[i]);
                }
            }
            self.droplets = newDroplets;
            if (self.splashTime == 0) {
                self.splash(Math.floor(Math.random() * self.springs.length), 2 * Math.random());
            }
            self.splashTime = (self.splashTime + 1) % 4;
            self.ctx.beginPath();
            self.ctx.moveTo(0, self.canvas.height);
            FileSplash.updateSprings(self.springs);
            for (var i = 0; i < self.springs.length; i++) {
                self.ctx.lineTo(self.springs[i].x, self.springs[i].bottomY - self.springs[i].baseY - self.springs[i].y);
            }
            self.ctx.lineTo(self.canvas.width, self.canvas.height);
            self.ctx.lineTo(0, self.canvas.height);
            self.ctx.fillStyle = FileSplash.Drawing.Colours.black;
            self.ctx.strokeStyle = FileSplash.Drawing.Colours.black;
            self.ctx.fill();
            self.ctx.stroke();
            if (self.running == true) {
                window.requestAnimationFrame(function () { self.draw(self); });
            }
            else {
                FileSplash.FrontEnd.hideID("drag-drop");
                FileSplash.FrontEnd.hideID("drag-drop-canvas");
            }
        };
        DropCanvas.prototype.drop = function (x, y) {
            this.dropped = true;
            this.files.push(new FileSplash.DropFile(x, y));
        };
        DropCanvas.prototype.stop = function () {
            if (this.dropped && !this.finished) {
                return;
            }
            this.running = false;
            FileSplash.FrontEnd.hideID("drag-drop");
            FileSplash.FrontEnd.hideID("drag-drop-canvas");
            var self = this;
            for (var i = 0; i < this.realFiles.length; i++) {
                for (var j = 0; j < this.onStopFuncs.length; j++) {
                    this.onStopFuncs[j](self.realFiles[i]);
                }
            }
            this.realFiles = [];
        };
        DropCanvas.prototype.splash = function (index, speed) {
            if (index >= 0 && index < this.springs.length) {
                this.springs[index].velocity = -speed;
            }
            if (speed > 10) {
                for (var i = 0; i < Math.floor(speed / 2); i++) {
                    var pos = new Maths.Vector2(index * this.segmentSize, this.canvas.height);
                    var vel = new Maths.Vector2(10 * Math.random() - 5, -speed * Math.random() / 4);
                    var droplet = new FileSplash.Droplet(pos, vel, 5 * Math.random());
                    this.droplets.push(droplet);
                }
            }
        };
        return DropCanvas;
    })();
    FileSplash.DropCanvas = DropCanvas;
})(FileSplash || (FileSplash = {}));
/// <reference path="dropCanvas.ts" />
var FileSplash;
(function (FileSplash) {
    function onFileSplash(func) {
        FileSplash.DropCanvas.Instance.onStopFuncs.push(function (realFile) {
            func(realFile.name, realFile.text);
        });
    }
    FileSplash.onFileSplash = onFileSplash;
    function clearOnFileSplashEvents() {
        FileSplash.DropCanvas.Instance.onStopFuncs = [];
    }
    FileSplash.clearOnFileSplashEvents = clearOnFileSplashEvents;
    if (typeof document != "undefined") {
        document.body.ondrag = function (e) {
            //e.preventDefault();
            return false;
        };
        document.body.ondrop = function (e) {
            e.preventDefault();
            FileSplash.DropCanvas.Instance.drop(e.clientX, e.clientY);
            var files = e.dataTransfer.files;
            var blah = e.dataTransfer.getData("utf8");
            var j = 0;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = function (e) {
                    var thisFile = files[j];
                    var fileText = e.target.result;
                    FileSplash.DropCanvas.Instance.realFiles.push(new FileSplash.RealFile(thisFile.name, fileText));
                    j++;
                };
                reader.readAsText(file);
            }
            return false;
        };
        document.body.ondragend = function (e) {
            e.preventDefault();
            FileSplash.DropCanvas.Instance.drop(e.clientX, e.clientY);
            return false;
        };
        var inCorrectFiles = false;
        document.body.ondragstart = function (e) {
            e.preventDefault();
            return false;
        };
        document.body.ondragenter = function (e) {
            e.preventDefault();
            return false;
        };
        document.body.ondragover = function (e) {
            e.preventDefault();
            FileSplash.DropCanvas.Instance.start();
            return false;
        };
        document.getElementById("drag-drop-canvas").ondragleave = function (e) {
            e.preventDefault();
            FileSplash.DropCanvas.Instance.stop();
            return false;
        };
    }
})(FileSplash || (FileSplash = {}));
var FileSplash;
(function (FileSplash) {
    var Drawing;
    (function (Drawing) {
        var Colours = (function () {
            function Colours() {
            }
            Colours.tan = "tan";
            Colours.peach = "orange";
            Colours.black = "black";
            Colours.white = "white";
            return Colours;
        })();
        Drawing.Colours = Colours;
    })(Drawing = FileSplash.Drawing || (FileSplash.Drawing = {}));
})(FileSplash || (FileSplash = {}));
var FileSplash;
(function (FileSplash) {
    var DropFile = (function () {
        function DropFile(x, y) {
            this.x = x;
            this.y = y;
            this.tilt = Math.random() * 2 * Math.PI;
            this.velocity = 0;
            this.acceleration = FileSplash.GRAVITY;
            this.removeThis = false;
        }
        DropFile.prototype.draw = function (ctx) {
            var self = this;
            ctx.translate(self.x, self.y);
            ctx.rotate(self.tilt);
            ctx.translate(-self.x, -self.y);
            var grd = ctx.createLinearGradient(self.x - 50, self.y - 50, self.x + 50, self.y + 50);
            var fold = 20;
            grd.addColorStop(0, FileSplash.Drawing.Colours.tan);
            grd.addColorStop(1, FileSplash.Drawing.Colours.peach);
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.moveTo(self.x - 50, self.y + 50);
            ctx.lineTo(self.x + 50, self.y + 50);
            ctx.lineTo(self.x + 50, self.y - 50);
            ctx.lineTo(self.x - fold, self.y - 50);
            ctx.lineTo(self.x - 50, self.y - fold);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(self.x - (fold + 4), self.y - 45);
            ctx.lineTo(self.x - 45, self.y - 45);
            ctx.lineTo(self.x - 45, self.y - (fold + 4));
            ctx.strokeStyle = FileSplash.Drawing.Colours.black;
            ctx.fillStyle = FileSplash.Drawing.Colours.white;
            ctx.fill();
            ctx.stroke();
            ctx.translate(self.x, self.y);
            ctx.rotate(-self.tilt);
            ctx.translate(-self.x, -self.y);
        };
        DropFile.prototype.getClosestSpring = function (springs) {
            var closestSpring = null;
            var dist = Infinity;
            for (var i = 0; i < springs.length; i++) {
                var tempDist = Math.abs(springs[i].x - this.x);
                if (tempDist < dist) {
                    closestSpring = springs[i];
                    dist = tempDist;
                }
            }
            return closestSpring;
        };
        DropFile.prototype.update = function (springTop) {
            var willSplash = false;
            this.y += this.velocity;
            this.velocity += this.acceleration;
            this.tilt += 0.01;
            if (springTop < this.y) {
                willSplash = true;
            }
            if (this.removeThis) {
                willSplash = false;
            }
            if (willSplash) {
                this.removeThis = true;
            }
            return willSplash;
        };
        return DropFile;
    })();
    FileSplash.DropFile = DropFile;
    var Splash = (function () {
        function Splash(index, strength) {
            this.index = index;
            this.strength = strength;
        }
        return Splash;
    })();
    FileSplash.Splash = Splash;
    function updateFiles(files, springs, springTop) {
        var splashes = [];
        for (var i = 0; i < files.length; i++) {
            var willSplash = files[i].update(springTop);
            if (willSplash) {
                var spring = files[i].getClosestSpring(springs);
                splashes.push(new Splash(spring.index, 5 * files[i].velocity));
            }
        }
        return splashes;
    }
    FileSplash.updateFiles = updateFiles;
    function drawFiles(files, ctx) {
        for (var i = 0; i < files.length; i++) {
            files[i].draw(ctx);
        }
    }
    FileSplash.drawFiles = drawFiles;
})(FileSplash || (FileSplash = {}));
var FileSplash;
(function (FileSplash) {
    var Droplet = (function () {
        function Droplet(pos, vel, r) {
            this.r = r;
            this.position = pos;
            this.velocity = vel;
        }
        Object.defineProperty(Droplet.prototype, "orientation", {
            get: function () {
                return Math.atan2(this.velocity.y, this.velocity.x);
            },
            enumerable: true,
            configurable: true
        });
        Droplet.prototype.update = function () {
            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;
            this.velocity.y += FileSplash.GRAVITY;
        };
        Droplet.prototype.draw = function (ctx) {
            ctx.beginPath();
            var r = this.r;
            var x = this.position.x;
            var y = this.position.y;
            var theta = this.orientation;
            var tail = Math.min(this.velocity.abs / 2, 4 * r);
            ctx.beginPath();
            ctx.fillStyle = FileSplash.Drawing.Colours.black;
            ctx.arc(x, y, r, theta - Math.PI / 2, theta + Math.PI / 2);
            ctx.lineTo(x + 3 * tail * Math.cos(theta + Math.PI), y + 3 * tail * Math.sin(theta + Math.PI));
            ctx.fill();
        };
        return Droplet;
    })();
    FileSplash.Droplet = Droplet;
})(FileSplash || (FileSplash = {}));
var FileSplash;
(function (FileSplash) {
    FileSplash.GRAVITY = 0.4;
})(FileSplash || (FileSplash = {}));
var FileSplash;
(function (FileSplash) {
    var FrontEnd;
    (function (FrontEnd) {
        function showID(id) {
            var item = document.getElementById(id);
            item.className = item.className.replace(/indubitebly-hidden/g, "");
        }
        FrontEnd.showID = showID;
        function hideID(id) {
            var item = document.getElementById(id);
            if (item.className.indexOf("indubitebly-hidden") == -1) {
                item.className = item.className + " indubitebly-hidden";
            }
        }
        FrontEnd.hideID = hideID;
    })(FrontEnd = FileSplash.FrontEnd || (FileSplash.FrontEnd = {}));
})(FileSplash || (FileSplash = {}));
var Maths;
(function (Maths) {
    function isWithinRadius(x1, y1, x2, y2, radius) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        var dr = Math.sqrt(dx * dx + dy * dy);
        return dr <= radius;
    }
    Maths.isWithinRadius = isWithinRadius;
    function pythagoras(x, y) {
        return Math.sqrt(x * x + y * y);
    }
    Maths.pythagoras = pythagoras;
})(Maths || (Maths = {}));
var FileSplash;
(function (FileSplash) {
    var Spring = (function () {
        function Spring(x, baseY, bottomY, index) {
            this.x = x;
            this.baseY = baseY;
            this.bottomY = bottomY;
            this.index = index;
            this.y = 20 * Math.random() - 10;
            this.tension = 0.01;
            this.dampeningFactor = 0.0001;
            this.velocity = 1 * Math.random() - 0.5;
        }
        Object.defineProperty(Spring.prototype, "acceleration", {
            get: function () {
                return -this.y * this.tension - this.velocity * this.dampeningFactor;
            },
            enumerable: true,
            configurable: true
        });
        Spring.prototype.update = function () {
            this.y += this.velocity;
            this.velocity += this.acceleration;
        };
        return Spring;
    })();
    FileSplash.Spring = Spring;
    function updateSprings(springs) {
        for (var i = 0; i < springs.length; i++) {
            springs[i].update();
        }
        var leftDeltas = [];
        var rightDeltas = [];
        var Spread = 0.1;
        for (var i = 0; i < springs.length; i++) {
            if (i > 0) {
                leftDeltas[i] = Spread * (springs[i].y - springs[i - 1].y);
                springs[i - 1].velocity += leftDeltas[i];
            }
            if (i < springs.length - 1) {
                rightDeltas[i] = Spread * (springs[i].y - springs[i + 1].y);
                springs[i + 1].velocity += rightDeltas[i];
            }
        }
        for (var i = 0; i < springs.length; i++) {
            if (i > 0) {
                springs[i - 1].y += leftDeltas[i];
            }
            if (i < springs.length - 1) {
                springs[i + 1].y += rightDeltas[i];
            }
        }
    }
    FileSplash.updateSprings = updateSprings;
})(FileSplash || (FileSplash = {}));
var FileSplash;
(function (FileSplash) {
    var Styles;
    (function (Styles) {
        function applyStyles() {
            var styleSheet = document.createElement("link");
            styleSheet.setAttribute("rel", "stylesheet");
            styleSheet.setAttribute("type", "text/css");
            styleSheet.setAttribute("href", "http://www.michalpaszkiewicz.co.uk/filesplash/styles.css");
            document.body.appendChild(styleSheet);
        }
        applyStyles();
    })(Styles = FileSplash.Styles || (FileSplash.Styles = {}));
})(FileSplash || (FileSplash = {}));
//# sourceMappingURL=@script.js.map