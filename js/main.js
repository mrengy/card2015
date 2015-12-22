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

        //define sun0 core image
        window.sun0 = new Image();
        sun0.src = 'img/sun0.png';

        console.log(sun0x0);
        console.log(sun0y0);
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


    } //end init
    
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
        drawCharacter(sun0, sun0x, sun0y, sun0w, sun0h);

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

    }

    function drawCharacter(name, x, y, w, h){
        ctx.drawImage(name, x, y, w, h);
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