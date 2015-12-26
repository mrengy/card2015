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
    var intervalId = 0;
    var frame = 0;
    var increment = 1;
    var volumeCenter = 20;
    var framesBetweenShift = 30;

    //reusable character variables
    var characters = [];
    var stars = [];
    var starIndex = 0;

    //specific character variables
    var orbit = {centerX:410, centerY:500, radius:600, angle:10};
    var sunParent = {x:-200, y:0,speed:.02};

    //load images
    function loadImages(){
        if (!characters[0]){
            var sun0 = new Character('sun0', sunParent.x, sunParent.y);
        } else if (!characters[1]){
            var sun1 = new Character('sun1', sunParent.x, sunParent.y);
        } else if (!characters[2]){
            var sun2 = new Character('sun2', sunParent.x, sunParent.y);
        } else if (!characters[3]){
            var bed = new Character('bed', 50, 500);
        } else if (!characters[4]){
            var plant1 = new Character('plant1', 480, 490);
        } else if(characters.every(imageLoaded)){
            $('button#play').show();
        }
        //test whether every object in array has the image loaded
        function imageLoaded(element, index, array){
            return element['imageObject']['loaded'] == true;
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

    function Character(name, x, y){
        //define the image object within the Character
        this.imageObject = new Image();
        this.imageObject.src = 'img/'+name+'.png';

        //console.log('character length = '+character.length);

        characters.push(this);
        //character[name] = this;
        var characterPosition = characters.indexOf(this);

        //set natural width and natural height once the image is loaded
        //conditional used by Chrome
        if (this.imageObject.addEventListener){
            this.imageObject.addEventListener('load', function(){
                var imgWidth = this.naturalWidth;
                var imgHeight = this.naturalHeight;

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
                var imgWidth = this.naturalWidth;
                var imgHeight = this.naturalHeight;

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
        intervalId = setInterval(draw, 33);

        //load the wav only if we need it, otherwise load the mp3
        if (typeof window.waapisimContexts != 'undefined'){
            loadSound("audio/home-grown-tomatoes.wav");
        } else {
            loadSound("audio/home-grown-tomatoes.mp3");
        }
    }

    function draw(){
        frame ++;
        clear();
        
        //draw characters
            //sun
            //move sun
            sunParent.x = orbit.centerX + Math.cos(orbit.angle) * orbit.radius;
            sunParent.y = orbit.centerY + Math.sin(orbit.angle) * orbit.radius;
            orbit.angle += sunParent.speed;

            drawCharacter(characters[0]['imageObject'],sunParent.x,sunParent.y,characters[0]['imageObject']['w'],characters[0]['imageObject']['h']);
            if(averageVolume - volumeCenter > 5){
                drawCharacter(characters[1]['imageObject'],sunParent.x,sunParent.y,characters[1]['imageObject']['w'],characters[1]['imageObject']['h']);
            }
            if(averageVolume - volumeCenter > 15){
                drawCharacter(characters[2]['imageObject'],sunParent.x,sunParent.y,characters[2]['imageObject']['w'],characters[2]['imageObject']['h']);
            }

            //console.log(averageVolume - volumeCenter);
            
            //bed
            drawCharacter(characters[3]['imageObject'],characters[3]['imageObject']['x1'],characters[3]['imageObject']['y1'],characters[3]['imageObject']['w'],characters[3]['imageObject']['h']);

            //plant1
            if(averageVolume > 0){
            ctx.save();
            ctx.translate(characters[4]['imageObject']['w']/2,0);
            ctx.translate(characters[4]['imageObject']['x1'], (characters[4]['imageObject']['y1']+characters[4]['imageObject']['h']));
            ctx.rotate((averageVolume - volumeCenter)*Math.PI/180);
            ctx.translate(-characters[4]['imageObject']['w']/2, -characters[4]['imageObject']['h']);
            drawCharacter(characters[4]['imageObject'], 0, 0, characters[4]['imageObject']['w'], characters[4]['imageObject']['h']);
            ctx.restore();
            } else {
                drawCharacter(characters[4]['imageObject'],characters[4]['imageObject']['x1'],characters[4]['imageObject']['y1'],characters[4]['imageObject']['w'],characters[4]['imageObject']['h']);
            }

            //nighttime objects
                var nightOpacity = setNightOpacity();
                if (nightOpacity > 0){
                    //draw night sky
                    ctx.save();
                    ctx.fillStyle = 'rgba(10,4,72,'+nightOpacity+')';
                    ctx.fillRect(0,0,WIDTH,HEIGHT);
                    ctx.restore();

                    //draw stars
                    drawStar(0);
                    drawStar(1);
                    pulseStars(0);
                    pulseStars(0);
                }
    }

    function drawCharacter(name, x, y, w, h){
        ctx.drawImage(name, x, y, w, h);
    }

    function setNightOpacity(){
        var nightOpacity = (sunParent.y-orbit.centerY)/orbit.centerY +.1;
        return nightOpacity;
    }
    
    function drawStar(index){
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,'+stars[index].thisOpacity+')';
        ctx.beginPath();
        ctx.arc(stars[index].thisX,stars[index].thisY,stars[index].thisRadius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    function pulseStars(index){
        if ((stars[index].thisOpacity < 1) && (stars[index].thisDirection == 'up')){
            stars[index].thisOpacity +=.01 ;
            //console.log(stars[index].thisOpacity);
        }
        /*
        console.log(stars[thisStar].thisOpacity);
        console.log(stars[thisStar].thisDirection);
        */
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