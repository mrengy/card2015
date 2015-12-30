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

    //specific character variables
    var orbit = {centerX:410, centerY:500, radius:600, angle:129.7};
    var sunParent = {x: 34.54885235659708, y:31.9867141487843,speed:.0005};
    var parentLogged = false;
    var maxSunSpeed = .02;
    var introOpacity = 1;

    //detecting drawing of the static intro screen
    var introScreenDrawn = false;

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
            var plant2 = new Character('plant2', 480, 490);
        } else if (!characters[8]){
            var plant3 = new Character('plant3', 480, 490);
        } else if (!characters[9]){
            var plant4 = new Character('plant4', 480, 490);
        } else if (!characters[10]){
            var can = new Character('can', 20, 490);
        } else if (!characters[11]){
            var kepler1 = new Character('kepler1', 800, 20);
        } else if (!characters[12]){
            var kepler4 = new Character('kepler4', 800, 20);
        } else if (!characters[13]){
            var lightning = new Character('lightning', 200, 490);
        } else if (!characters[14]){
            var fry = new Character('fry', 200, 490);
        } else if (!characters[15]){
            var can_front = new Character('can-front', 20, 490);
        } else if (!characters[16]){
            var bed_front = new Character('bed-front', 50, 500);
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
            console.log('star created');
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
                characters[characterPosition]['imageObject']['x1'] = x;
                characters[characterPosition]['imageObject']['y1'] = y;

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
                characters[characterPosition]['imageObject']['x1'] = x;
                characters[characterPosition]['imageObject']['y1'] = y;

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
            } else { //run only if songIntroDone is true
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

                if (parentLogged == false){
                    parentLogged = true;
                }
                //detect day change
                if ((nightOpacity > 0) && (prevSunHeight >= sunParent.y) && (dayChanged == false)){
                    day ++;
                    dayChanged = true;
                } else if ((nightOpacity <= 0) && (prevSunHeight <= sunParent.y) && (dayChanged == true)){
                    dayChanged = false;
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

                //plant1
                if (day == 1){
                    if(averageVolume > 0){
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
                    if(averageVolume > 0){
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

                //bed front
                drawCharacter(characters[16]['imageObject'],characters[16]['imageObject']['x1'],characters[16]['imageObject']['y1'],characters[16]['imageObject']['w'],characters[16]['imageObject']['h']);
            }
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
                console.log('intro drawn');

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
            index.thisOpacity += .06 ;
        }
        if (index.thisOpacity >= 1){
            index.thisDirection = 'down';
        }
        if ((index.thisOpacity > 0) && (index.thisDirection == 'down')){
            index.thisOpacity -= .06;
        }
        if (index.thisOpacity <= 0){
            index.thisDirection = 'up';
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
    loadImages();
    init();
    setupAudioNodes();
    createStars(30);

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