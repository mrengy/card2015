$( document ).ready(function() {
    // create the audio context (chrome only for now)
    if (! window.AudioContext) {
        if (! window.webkitAudioContext) {
            alert('no audiocontext found');
        }
        window.AudioContext = window.webkitAudioContext;
    }

    //audio context variables
    var context = new AudioContext();
    var audioBuffer;
    var sourceNode;
    var splitter;
    var analyser, analyser2;
    var javascriptNode;

    //audio control variables
    var musicStarted = false;
    
    //canvas variables
    var context;
    var container;
    var ctx;
    var WIDTH;
    var HEIGHT;
    var drawInterval = 0;
    var drawIntroInterval = 0;
    var frame = 0;
    var increment = 1;
    var volumeCenter = 20;
    var framesPerMs = 33;

    //reusable character variables
    var characters = [];
    var stars = [];
    var starIndex = 0;

    //day variables
    var dayChanged = false;
    var day = 0;
    // 0

    //specific character variables
    var orbit = {centerX:410, centerY:500, radius:600, angle:129.7};
    var sunParent = {x0: 34.54885235659708, x: 34.54885235659708, y0:31.9867141487843, y:31.9867141487843,speed:.0005};
    var maxSunSpeed = .01;
    // .01
    var introOpacity = 1;
    var lightningSpeed = lightningMaxSpeed = usSpeed = usMaxSpeed = 7;
    var lightningDirection = 'up';
    var lightningRotation = 0;

    //detecting start and end
    var introScreenDrawn = false;
    var lastDay = 7;
    var sunSlowingRange = 20;

    //detecting start of song after the musical intro
    var numPeaks = 0;
    var peakMinimum = 40;
    var peaksUntilStart = 52;
    var songIntroDone = false;

    //load images
    function loadImages(){
        if (!characters[0]){
            //create tomatoVine at double size since it will be used at different scales
            var tomatoVine = new Character('tomatovine', 480, 490, true);
        } else if (!characters[1]){
            //create tomatoVine at double size since it will be used at different scales
            var tomatoVineFlipped = new Character('tomatovine-flipped', 480, 490, true);
        } else if (!characters[2]){
            var sun0 = new Character('sun0', sunParent.x, sunParent.y);
        } else if (!characters[3]){
            var sun1 = new Character('sun1', sunParent.x, sunParent.y);
        } else if (!characters[4]){
            var sun2 = new Character('sun2', sunParent.x, sunParent.y);
        } else if (!characters[5]){
            var bed = new Character('bed', 50, 500);
        } else if (!characters[6]){
            var plant1 = new Character('plant1', 480, 490);
        } else if (!characters[7]){
            var plant2 = new Character('plant2', 460, 405);
        } else if (!characters[8]){
            var plant3 = new Character('plant3', 440, 350);
        } else if (!characters[9]){
            var plant4 = new Character('plant4', 345, 325);
        } else if (!characters[10]){
            var can = new Character('can', 150, 510);
        } else if (!characters[11]){
            var kepler1 = new Character('kepler1', 800, 20);
        } else if (!characters[12]){
            var kepler4 = new Character('kepler4', 700, 480);
        } else if (!characters[13]){
            var lightning = new Character('lightning', 185, 540);
        } else if (!characters[14]){
            var fry = new Character('fry', 200, 490);
        } else if (!characters[15]){
            var can_front = new Character('can-front', 150, 510);
        } else if (!characters[16]){
            var bed_front = new Character('bed-front', 50, 500);
        } else if (!characters[17]){
            //create tomato at double size since it will be used at different scales
            var tomato = new Character('tomato', 400, 435, true);
        } else if (!characters[18]){
            var us = new Character('us', 50, 1000);
        } else if(characters.every(imageLoaded)){
            $('button#play').show();
        }
        //test whether every object in array has the image loaded
        function imageLoaded(element, index, array){
            return element['imageObject']['loaded'] == true;
        }

        //draw intro screen after tomatovine is loaded
        if ((imageLoaded(characters[0])) && (imageLoaded(characters[1])) && (introScreenDrawn == false)){
            drawIntroScreen();
            introScreenDrawn = true;
        }

    }

    function createStars(number){
        for (var i = 0; i < number; i++){
            createStar(getRandomInt(0,WIDTH), getRandomInt(0,500), getRandomInt(1,3),getRandomInt(0,10)/10);
        }
    }

    function init(){

        //set canvas context
        canvas = (typeof(G_vmlCanvasManager) != 'undefined') ? G_vmlCanvasManager.initElement($("canvas#card")[0]) : $("canvas#card")[0];
        ctx = canvas.getContext('2d');
        ctx.font = "20.0px Arial, Helvetica, sans-serif";
        container = $(canvas).parent();
        WIDTH = canvas.width;
        HEIGHT = canvas.height;

        //generic font settings
        ctx.textAlign = 'right';
        ctx.font = "italic bold 42pt Arial, 'Helvetica Neue', Helvetica, sans-serif";

    } //end init

    function Character(name, x, y, doubleSize){
        //define the image object within the Character
        this.imageObject = new Image();
        this.imageObject.src = 'img/'+name+'.png';

        characters.push(this);
        //character[name] = this;
        var characterPosition = characters.indexOf(this);

        //set natural width and natural height once the image is loaded
        //conditional used by Chrome
        if (this.imageObject.addEventListener){
            this.imageObject.addEventListener('load', function(){
                if (doubleSize == true){
                    var imgWidth = this.naturalWidth/2;
                    var imgHeight = this.naturalHeight/2;
                } else {
                    var imgWidth = this.naturalWidth;
                    var imgHeight = this.naturalHeight;
                }

                //set natural width and natural height to object
                characters[characterPosition]['imageObject']['w'] = characters[characterPosition]['imageObject']['w0'] = imgWidth;
                characters[characterPosition]['imageObject']['h'] = characters[characterPosition]['imageObject']['h0'] = imgHeight;

                //set initial x and y position
                characters[characterPosition]['imageObject']['x1'] = characters[characterPosition]['imageObject']['x0'] = x;
                characters[characterPosition]['imageObject']['y1'] = characters[characterPosition]['imageObject']['y0'] = y;

                //set loaded property for the object once loading is done
                characters[characterPosition]['imageObject']['loaded'] = true;

                //run loadImages again to load the next image or show the button when all are loaded
                loadImages();
            });
        } else if (this.imageObject.attachEvent){
            this.imageObject.attachEvent('onload', function(){
                if (doubleSize == true){
                    var imgWidth = this.naturalWidth/2;
                    var imgHeight = this.naturalHeight/2;
                } else {
                    var imgWidth = this.naturalWidth;
                    var imgHeight = this.naturalHeight;
                }

                //set natural width and natural height to object
                characters[characterPosition]['imageObject']['w'] = characters[characterPosition]['imageObject']['w0'] = imgWidth;
                characters[characterPosition]['imageObject']['h'] = characters[characterPosition]['imageObject']['h0'] = imgHeight;

                //set initial x and y position
                characters[characterPosition]['imageObject']['x1'] = characters[characterPosition]['imageObject']['x0'] = x;
                characters[characterPosition]['imageObject']['y1'] = characters[characterPosition]['imageObject']['y0'] = y;

                //set loaded property for the object once loading is done
                characters[characterPosition]['imageObject']['loaded'] = true;

                //run loadImages again to load the next image or show the button when all are loaded
                loadImages();
            });
        }
    }

    function createStar(x,y,radius, initialOpacity){
        //create a star
        stars.push({
            thisX: x,
            thisY: y,
            thisRadius: radius,
            thisOpacity: initialOpacity,
            thisDirection: 'up'
        });
        starIndex ++;
    }

    function startDrawing(){
        $('button#play').hide();
        //load the wav only if we need it, otherwise load the mp3
        if (typeof window.waapisimContexts != 'undefined'){
            loadSound("audio/home-grown-tomatoes.wav");
        } else {
            loadSound("audio/home-grown-tomatoes.mp3");
        }

        drawIntroInterval = setInterval(drawIntroScreen, framesPerMs);

    }

    function draw(){
        frame ++;
        clear();
        
        //draw characters
            if (songIntroDone == false) {
                detectSongIntroDone();
            } else if ((day < lastDay) || (sunParent.x0 - sunParent.x > sunSlowingRange) || (sunParent.y - sunParent.y0 > sunSlowingRange)  ) { //run only if songIntroDone is true
                //for detecting day change
                var nightOpacity = setNightOpacity();

                //move sun
                var prevSunHeight = sunParent.y;

                sunParent.x = orbit.centerX + Math.cos(orbit.angle) * orbit.radius;
                sunParent.y = orbit.centerY + Math.sin(orbit.angle) * orbit.radius;
                orbit.angle += sunParent.speed;
                
                //ease sun speed
                if (sunParent.speed < maxSunSpeed){
                    sunParent.speed += .0005;
                }

                //detect day change
                if ((nightOpacity > 0) && (prevSunHeight >= sunParent.y) && (dayChanged == false)){
                    day ++;
                    dayChanged = true;
                } else if ((nightOpacity <= 0) && (prevSunHeight <= sunParent.y) && (dayChanged == true)){
                    dayChanged = false;
                }
            } else {
                //slowing and then stopping the sun
                sunParent.x = orbit.centerX + Math.cos(orbit.angle) * orbit.radius;
                sunParent.y = orbit.centerY + Math.sin(orbit.angle) * orbit.radius;
                orbit.angle += sunParent.speed;
                
                //ease sun speed
                if (sunParent.speed > 0){
                    sunParent.speed -= .0005;
                }
            }

            //sun
            drawCharacter(characters[2]['imageObject'],sunParent.x,sunParent.y,characters[2]['imageObject']['w'],characters[2]['imageObject']['h']);
            if (averageVolume - volumeCenter > 5){
                drawCharacter(characters[3]['imageObject'],sunParent.x,sunParent.y,characters[3]['imageObject']['w'],characters[3]['imageObject']['h']);
            }
            if (averageVolume - volumeCenter > 15){
                drawCharacter(characters[4]['imageObject'],sunParent.x,sunParent.y,characters[4]['imageObject']['w'],characters[4]['imageObject']['h']);
            }
            
            //draw daytime objects if it is not the middle of the night
            if (!nightOpacity || nightOpacity < 1){
                //bed
                drawCharacter(characters[5]['imageObject'],characters[5]['imageObject']['x1'],characters[5]['imageObject']['y1'],characters[5]['imageObject']['w'],characters[5]['imageObject']['h']);

                ///can
                if (day > 0){
                    drawCharacter(characters[10]['imageObject'],characters[10]['imageObject']['x1'],characters[10]['imageObject']['y1'],characters[10]['imageObject']['w'],characters[10]['imageObject']['h']);
                }

                //plant1
                if (day == 1){
                    if (averageVolume - volumeCenter > 0){
                    ctx.save();
                    ctx.translate(characters[6]['imageObject']['w']/2,0);
                    ctx.translate(characters[6]['imageObject']['x1'], (characters[6]['imageObject']['y1']+characters[6]['imageObject']['h']));
                    ctx.rotate((averageVolume - volumeCenter)*Math.PI/180);
                    ctx.translate(-characters[6]['imageObject']['w']/2, -characters[6]['imageObject']['h']);
                    drawCharacter(characters[6]['imageObject'], 0, 0, characters[6]['imageObject']['w'], characters[6]['imageObject']['h']);
                    ctx.restore();
                    } else {
                        drawCharacter(characters[6]['imageObject'],characters[6]['imageObject']['x1'],characters[6]['imageObject']['y1'],characters[6]['imageObject']['w'],characters[6]['imageObject']['h']);
                    }
                }

                //plant2
                if (day == 2){
                    if (averageVolume - volumeCenter > 0){
                    ctx.save();
                    ctx.translate(characters[7]['imageObject']['w']/2,0);
                    ctx.translate(characters[7]['imageObject']['x1'], (characters[7]['imageObject']['y1']+characters[7]['imageObject']['h']));
                    ctx.rotate((averageVolume - volumeCenter)*Math.PI/180);
                    ctx.translate(-characters[7]['imageObject']['w']/2, -characters[7]['imageObject']['h']);
                    drawCharacter(characters[7]['imageObject'], 0, 0, characters[7]['imageObject']['w'], characters[7]['imageObject']['h']);
                    ctx.restore();
                    } else {
                        drawCharacter(characters[7]['imageObject'],characters[7]['imageObject']['x1'],characters[7]['imageObject']['y1'],characters[7]['imageObject']['w'],characters[7]['imageObject']['h']);
                    }
                }

                //plant3
                if (day == 3){
                    if (averageVolume - volumeCenter > 0){
                    ctx.save();
                    ctx.translate(characters[8]['imageObject']['w']/2,0);
                    ctx.translate(characters[8]['imageObject']['x1'], (characters[8]['imageObject']['y1']+characters[8]['imageObject']['h']));
                    ctx.rotate((averageVolume - volumeCenter)*Math.PI/180);
                    ctx.translate(-characters[8]['imageObject']['w']/2, -characters[8]['imageObject']['h']);
                    drawCharacter(characters[8]['imageObject'], 0, 0, characters[8]['imageObject']['w'], characters[8]['imageObject']['h']);
                    ctx.restore();
                    } else {
                        drawCharacter(characters[8]['imageObject'],characters[8]['imageObject']['x1'],characters[8]['imageObject']['y1'],characters[8]['imageObject']['w'],characters[8]['imageObject']['h']);
                    }
                }

                
                if (day >= 4){
                    //plant4
                    drawCharacter(characters[9]['imageObject'],characters[9]['imageObject']['x1'],characters[9]['imageObject']['y1'],characters[9]['imageObject']['w'],characters[9]['imageObject']['h']);
                    
                    //lightning
                    ctx.save();
                    ctx.translate(characters[13]['imageObject']['x1']+characters[13]['imageObject']['w']/2,characters[13]['imageObject']['y1']+characters[13]['imageObject']['h']/2);
                    ctx.rotate(lightningRotation*Math.PI/180);
                    drawCharacter(characters[13]['imageObject'],-characters[13]['imageObject']['w']/2,-characters[13]['imageObject']['h']/2,characters[13]['imageObject']['w'],characters[13]['imageObject']['h']);
                    ctx.restore();

                    jumpLightning();

                    //can front
                    drawCharacter(characters[15]['imageObject'],characters[15]['imageObject']['x1'],characters[15]['imageObject']['y1'],characters[15]['imageObject']['w'],characters[15]['imageObject']['h']);
                }

                //bed front
                drawCharacter(characters[16]['imageObject'],characters[16]['imageObject']['x1'],characters[16]['imageObject']['y1'],characters[16]['imageObject']['w'],characters[16]['imageObject']['h']);

                //tomatoes
                if (day >= 5){
                    //tomatoes
                    pulseCharacter(17, 400, 435, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 405, 425, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 407, 420, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 415, 440, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 420, 430, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 422, 420, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);

                    pulseCharacter(17, 522, 380, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 502, 390, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 509, 409, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 526, 406, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 536, 412, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 540, 402, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 542, 418, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 550, 422, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);

                    pulseCharacter(17, 530, 492, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 542, 502, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 532, 500, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 550, 509, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 540, 519, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 555, 529, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);

                    pulseCharacter(17, 460, 485, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 455, 475, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 467, 462, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 455, 450, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 460, 480, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 468, 410, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);

                    pulseCharacter(17, 480, 515, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 485, 495, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 497, 502, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 495, 510, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 500, 510, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                    pulseCharacter(17, 502, 460, characters[17]['imageObject']['w'],characters[17]['imageObject']['h']);
                }

                if (day >= 6){
                    //kepler
                    drawCharacter(characters[12]['imageObject'],characters[12]['imageObject']['x1'],characters[12]['imageObject']['y1'],characters[12]['imageObject']['w'],characters[12]['imageObject']['h']);
                }

                if (day >= 7){
                    //us
                    var usMaxHeight = 630;
                    if (characters[18]['imageObject']['y1'] > usMaxHeight){
                        characters[18]['imageObject']['y1'] -= usSpeed;
                        if (characters[18]['imageObject']['y1'] - usMaxHeight < 100 && usSpeed > .23) {
                            usSpeed -= .23;
                            //console.log(usSpeed);
                        }
                    }
                    drawCharacter(characters[18]['imageObject'],characters[18]['imageObject']['x1'],characters[18]['imageObject']['y1'],characters[18]['imageObject']['w'],characters[18]['imageObject']['h']);

                    //words
                    ctx.save();
                    ctx.fillStyle = 'gray';
                    ctx.fillText('Happy New Year!', WIDTH-50, 80);
                    ctx.font = "24pt Arial, 'Helvetica Neue', Helvetica, sans-serif";
                    ctx.fillText("Here's to another year full of love", WIDTH-50,150);
                    ctx.fillText("and home grown tomatoes",WIDTH-50,185);
                    ctx.font = "12pt Arial, 'Helvetica Neue', Helvetica, sans-serif";
                    ctx.fillText("♥ Emily, Mike, Kepler, and The Lightning",WIDTH-50,240);
                    ctx.restore();


                }

            } //end day objects

            //nighttime objects
                if (nightOpacity > 0){
                    //draw night sky
                    ctx.save();
                    ctx.fillStyle = 'rgba(10,4,72,'+nightOpacity+')';
                    ctx.fillRect(0,0,WIDTH,HEIGHT);
                    ctx.restore();

                    //draw stars
                    stars.forEach(drawStar);
                    stars.forEach(pulseStar);
                }
    }

    function drawCharacter(name, x, y, w, h){
        ctx.drawImage(name, x, y, w, h);
    }

    function setNightOpacity(){
        var nightOpacity = (sunParent.y-orbit.centerY)/orbit.centerY +.1;
        return nightOpacity;
    }

    function drawIntroScreen(){
        if(introOpacity < 1){
            draw();
        }

        //remove the timer for the intro and set another timer for the main drawing when intro opacity is 0;
        if (introOpacity <= 0){
            drawInterval = setInterval(draw, framesPerMs);
            clearInterval(drawIntroInterval);
        } else {
            //draw white background below tomato vines
            ctx.save();
            ctx.fillStyle = 'rgba(255,255,255,'+introOpacity+')';
            ctx.fillRect(0,0,WIDTH,HEIGHT);
            ctx.restore();

            //opacity for tomato vine characters
            ctx.save();
            ctx.globalAlpha = introOpacity;

                //top left
                ctx.save();
                ctx.rotate(-15*Math.PI/180);
                drawCharacter(characters[0]['imageObject'],0,15,characters[0]['imageObject']['w']*2,characters[0]['imageObject']['h']*2);
                ctx.restore();

                //top right
                ctx.save();
                ctx.translate(WIDTH,0);
                ctx.rotate(15*Math.PI/180);
                drawCharacter(characters[1]['imageObject'],(-characters[1]['imageObject']['w']*2),15,characters[1]['imageObject']['w']*2,characters[1]['imageObject']['h']*2);
                ctx.restore();

                //bottom right
                ctx.save();
                ctx.translate(WIDTH,HEIGHT);
                ctx.rotate(180*Math.PI/180);
                ctx.rotate(-15*Math.PI/180);
                drawCharacter(characters[0]['imageObject'],0,15,characters[0]['imageObject']['w']*2,characters[0]['imageObject']['h']*2);
                ctx.restore();

                //bottom left
                ctx.save();
                ctx.translate(0,HEIGHT);
                ctx.rotate(180*Math.PI/180);
                ctx.rotate(15*Math.PI/180);
                drawCharacter(characters[1]['imageObject'],(-characters[1]['imageObject']['w']*2),15,characters[1]['imageObject']['w']*2,characters[1]['imageObject']['h']*2);
                ctx.restore();

                //draw white background above tomato vines
                ctx.save();
                ctx.fillStyle = 'rgba(255,255,255,'+(1-introOpacity)+')';
                ctx.fillRect(0,0,WIDTH,HEIGHT);
                ctx.restore();

                introOpacity -= .01;

            ctx.restore();
        }
    }

    function detectSongIntroDone(){
        if (averageVolume > peakMinimum){
                numPeaks ++;
        }
        if (numPeaks >= peaksUntilStart){
            songIntroDone = true;
        }
    }
    
    function drawStar(index){
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,'+index.thisOpacity+')';
        ctx.beginPath();
        ctx.arc(index.thisX,index.thisY,index.thisRadius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    function pulseStar(index){
        if ((index.thisOpacity < 1) && (index.thisDirection == 'up')){
            index.thisOpacity += .02 ;
        }
        if (index.thisOpacity >= 1){
            index.thisDirection = 'down';
        }
        if ((index.thisOpacity > 0) && (index.thisDirection == 'down')){
            index.thisOpacity -= .02;
        }
        if (index.thisOpacity <= 0){
            index.thisDirection = 'up';
        }
    }

    function pulseCharacter(characterIndex, x, y, initialWidth, initialHeight){
        var thisCharacterWidth;
        var thisCharacterHeight;

        ctx.save();

        //the pulsing, only if volume is above threshold
            //set width
            if (averageVolume - volumeCenter > 0){
                thisCharacterWidth = initialWidth + (averageVolume - volumeCenter)*.5;
            } else {
                thisCharacterWidth = initialWidth;
            }
            //set height proportionally to width
            thisCharacterHeight = thisCharacterWidth * (initialHeight / initialWidth);

        //shift to center the character, when it is pulsing size
        ctx.translate((initialWidth - thisCharacterWidth)/2, (initialHeight - thisCharacterHeight)/2);
        
        //draw it!
        drawCharacter(characters[characterIndex]['imageObject'], x, y, thisCharacterWidth, thisCharacterHeight);

        ctx.restore();
    }

    function jumpLightning(){
        var lightningMaxHeight = 30;
        var lightningMinHeight = characters[13]['imageObject']['y0'];

        if (lightningDirection == 'up') {
            //up
            characters[13]['imageObject']['y1'] -= lightningSpeed;

            //slow down the ascent
            if ( (characters[13]['imageObject']['y1'] - lightningMaxHeight < 100) && (lightningSpeed > 0)) {
                lightningSpeed -= .2;
            }
            if (lightningSpeed <= 0){
                lightningDirection = 'down';
            }

        } else {
            //down
            if (characters[13]['imageObject']['y1'] < lightningMinHeight){
                characters[13]['imageObject']['y1'] += lightningSpeed;

                //gain speed down
                if ( (characters[13]['imageObject']['y1'] - lightningMaxHeight < 100) && (lightningSpeed < lightningMaxSpeed)) {
                    lightningSpeed += .2;
                }
            } else {
                window.setTimeout(reverseDirection,750);

                function reverseDirection(){
                    lightningDirection = 'up';
                    lightningRotation = 0;
                }
            }
        }
        //rotate at the peak when the speed slows down
        if (lightningSpeed < lightningMaxSpeed && lightningRotation < 180){
            lightningRotation += 5;
        }
    }

    function clear() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    
    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function setupAudioNodes() {

        // setup a javascript node
        javascriptNode = context.createScriptProcessor(2048, 1, 1);
        // connect to destination, else it isn't called
        javascriptNode.connect(context.destination);


        // setup a analyzer
        analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024;

        analyser2 = context.createAnalyser();
        analyser2.smoothingTimeConstant = 0.0;
        analyser2.fftSize = 1024;

        // create a buffer source node
        sourceNode = context.createBufferSource();
        splitter = context.createChannelSplitter();

        // connect the source to the analyser and the splitter
        sourceNode.connect(splitter);

        // connect one of the outputs from the splitter to
        // the analyser
        splitter.connect(analyser,0,0);
        splitter.connect(analyser2,1,0);

        // connect the splitter to the javascriptnode
        // we use the javascript node to draw at a
        // specific interval.
        analyser.connect(javascriptNode);

        // and connect to destination
        sourceNode.connect(context.destination);
    }

    // load the specified sound
    function loadSound(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // When loaded decode the data
        request.onload = function() {

            // decode the data
            context.decodeAudioData(request.response, function(buffer) {
                // when the audio is decoded play the sound
                playSound(buffer);
            }, onError);
        }
        request.send();
    }


    function playSound(buffer) {
        sourceNode.buffer = buffer;
        sourceNode.start(0);
        musicStarted = true;
    }

    // log if an error occurs
    function onError(e) {
        console.log(e);
    }

    //RUN FUNCTIONS
    focusBrowserWarning();
    loadImages();
    init();
    setupAudioNodes();
    createStars(30);

    //focus on the browser warning if it exists
    function focusBrowserWarning(){
        if($('#browserupgrade').is(":visible")){
            $('button#play').removeAttr('autofocus');
            $('#browserupgrade').attr('autofocus','autofocus');
        }
    }

    // when the javascript node is called
    // we use information from the analyzer node
    // to draw the volume
    javascriptNode.onaudioprocess = function() {

        // get the average for the first channel
        var array =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        averageVolume = getAverageVolume(array);
    }

    function getAverageVolume(array) {
        var values = 0;
        var average;

        var length = array.length;

        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }

        average = values / length;
        return average;
    }
    
    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    //iOS audio hack http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
    window.addEventListener('touchstart', function() {

        // create empty buffer
        var buffer = context.createBuffer(1, 1, 22050);
        var source = context.createBufferSource();
        source.buffer = buffer;

        // connect to output (your speakers)
        source.connect(context.destination);

        // play the file
        source.noteOn(0);

    }, false);
    //end iOS audio hack
    
    $('button#play').on('click', startDrawing);
});