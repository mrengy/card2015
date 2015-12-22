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
    var averageVolume = averageVolume2 = 0;
    
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

    //character objects
    //define sun images
        var sun0 = new Character ('sun0', 1, 0);
        var sun1 = new Character ('sun1', 1, 0);
        var sun2 = new Character('sun2', 1, 0);

    function init(){
    //set canvas context
        canvas = (typeof(G_vmlCanvasManager) != 'undefined') ? G_vmlCanvasManager.initElement($("canvas#card")[0]) : $("canvas#card")[0];
        ctx = canvas.getContext('2d');
        ctx.font = "20.0px Arial, Helvetica, sans-serif";
        container = $(canvas).parent();

        

        respondCanvas();

        //define plant1 image
        window.plant1 = new Image();
        plant1.src = 'img/plant1.png';
        /*
        console.log(plant1x0);
        console.log(plant1y0);
        */
        window.plant1w;
        window.plant1h;
        window.plant1w0;
        window.plant1h0;
        //set natural width and natural height once the image is loaded
        if (plant1.addEventListener){
            plant1.addEventListener('load', function(){
                plant1w = plant1w0 = plant1.naturalWidth/2;
                plant1h = plant1h0 = plant1.naturalHeight/2;
            }, false);
        } else if (plant1.attachEvent){
            plant1.attachEvent('onload', function(){
                plant1w = plant1w0 = plant1.naturalWidth/2;
                plant1h = plant1h0 = plant1.naturalHeight/2;
            });
        }

        /*
        //define sun0 core image
        window.sun0 = new Image();
        sun0.src = 'img/sun0.png';

        window.sun0w;
        window.sun0h;
        window.sun0w0;
        window.sun0h0;
        //set natural width and natural height once the image is loaded
        if (sun0.addEventListener){
            sun0.addEventListener('load', function(){
                sun0w = sun0w0 = sun0.naturalWidth/2;
                sun0h = sun0h0 = sun0.naturalHeight/2;
            }, false);
        } else if (sun0.attachEvent){
            sun0.attachEvent('onload', function(){
                sun0w = sun0w0 = sun0.naturalWidth/2;
                sun0h = sun0h0 = sun0.naturalHeight/2;
            });
        }

        //define sun1 core image
        window.sun1 = new Image();
        sun1.src = 'img/sun1.png';

        window.sun1w;
        window.sun1h;
        window.sun1w0;
        window.sun1h0;
        //set natural width and natural height once the image is loaded
        if (sun1.addEventListener){
            sun1.addEventListener('load', function(){
                sun1w = sun1w0 = sun1.naturalWidth/2;
                sun1h = sun1h0 = sun1.naturalHeight/2;
            }, false);
        } else if (sun1.attachEvent){
            sun1.attachEvent('onload', function(){
                sun1w = sun1w0 = sun1.naturalWidth/2;
                sun1h = sun1h0 = sun1.naturalHeight/2;
            });
        }
        */
        


    } //end init
    
    //define images
    /*
    function defineImage(name, x, y){
        window[name] = new Image();
        name.src = 'img/'+name+'.png';
        name['w'];
        name['h'];
        name['w0'];
        name['h0'];
        //reset x and y for sun 0
        window[name]['x'] = window[name]['x0'] = x;
        name['y'] = name['y0'] = y;

        
        console.log(name);
        console.log(name.src);
        console.log(name['x']);
        console.log(name['y']);
        
        //set natural width and natural height once the image is loaded
        if (name.addEventListener){
            name.addEventListener('load', function(){
                name[w] = name[w0] = name.naturalWidth/2;
                name[h] = name[h0] = name.naturalHeight/2;
            }, false);
        } else if (name.attachEvent){
            name.attachEvent('onload', function(){
                name[w] = name[w0] = name.naturalWidth/2;
                name[h] = name[h0] = name.naturalHeight/2;
            });
        }
    }
    */
    function Character(name, x, y){
        //this['name'] = name; //may cause conflict with "name"

        //define the image object within the Character
        this.imageObject = new Image();
        this.imageObject.src = 'img/'+name+'.png';

        //set natural width and natural height once the image is loaded
        if (this.imageObject.addEventListener){
            this.imageObject.addEventListener('load', function(){
                this['w'] = this['w0'] = this.naturalWidth/2;
                this['h'] = this['h0'] = this.naturalHeight/2;
            }, false);
        } else if (this.imageObject.attachEvent){
            this.imageObject.attachEvent('onload', function(){
                this['w']= this['w0'] = this.naturalWidth/2;
                this['h']= this['h0'] = this.naturalHeight/2;
            });
        }

        //set initial x and y position
        this['x'] = x;
        this['y'] = y;
    }

    //relative position functions
    function positionPlant1(){
        //reset x and y for plant 1
        window.plant1x = window.plant1x0 = WIDTH / 2;
        window.plant1y = window.plant1y0 = HEIGHT / 2;        
    }
    function positionSun0(){
        //reset x and y for sun 0
        window.sun0x = window.sun0x0 = 0;
        window.sun0y = window.sun0y0 = 0;

        //convert to percentages
        window.sun0x = (window.sun0x/100)*WIDTH;
        window.sun0y = (window.sun0y/100)*HEIGHT;
    }
    function positionSun1(){
        //reset x and y for sun 0
        window.sun1x = window.sun1x0 = 0;
        window.sun1y = window.sun1y0 = 0;

        //convert to percentages
        window.sun1x = (window.sun1x/100)*WIDTH;
        window.sun1y = (window.sun1y/100)*HEIGHT;
    }
    function positionSun2(){
        //convert to percentages
        sun2['x'] = (sun2['x']/100)*WIDTH;
        sun2['y'] = (sun2['y']/100)*HEIGHT;
    }

    function startDrawing(){
        $('button#play').hide();
        intervalId = setInterval(draw, 10);
        
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
        
        //draw sun
        drawCharacter(sun0, sun0['x'], sun0['y'], sun0['w'], sun0['h']);
        drawCharacter(sun1, sun1['x'], sun1['y'], sun1['w'], sun1['h']);
        drawCharacter(sun2, sun2['x'], sun2['y'], sun2['w'], sun2['h']);
        /*
        //draw plant 1
        if(averageVolume - volumeCenter > 0){
            //increase width based on volume
            plant1w = plant1w0 + (averageVolume - volumeCenter);
            //set height proportionally to width
            plant1h = (plant1w * (plant1h0 / plant1w0) );
            
            //pulse size
            ctx.save();
            ctx.translate( plant1x, plant1y );
            drawCharacter(plant1, 0, -(plant1h-plant1h0), plant1w, plant1h);
            ctx.restore();
        } else {
            //reset width and height to natural size
            plant1w = plant1w0;
            plant1h = plant1h0;
            drawCharacter(plant1, plant1x, plant1y, plant1w, plant1h);
            //console.log(averageVolume);
        }
        */
    }

    //reset height and width
    $(window).resize(respondCanvas);

    function respondCanvas(){
        $(canvas).attr('width', $(container).width() );
        $(canvas).attr('height', $(window).height() );

        //reset canvas width and height
        WIDTH = canvas.width;
        HEIGHT = canvas.height;

        positionPlant1();
        positionSun0();
        positionSun1();
        positionSun2();

    }

    function drawCharacter(name, x, y, w, h){
        ctx.drawImage(name.imageObject, x, y, w, h);
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

//        splitter.connect(context.destination,0,0);
//        splitter.connect(context.destination,0,1);

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
    init();
    setupAudioNodes();

    // when the javascript node is called
    // we use information from the analyzer node
    // to draw the volume
    javascriptNode.onaudioprocess = function() {

        // get the average for the first channel
        var array =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        averageVolume = getAverageVolume(array);

        // get the average for the second channel
        var array2 =  new Uint8Array(analyser2.frequencyBinCount);
        analyser2.getByteFrequencyData(array2);
        averageVolume2 = getAverageVolume(array2);

        // clear the current state
        //ctx.clearRect(0, 0, 60, 130);
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
    
    $('button#play').on('click', startDrawing );
});