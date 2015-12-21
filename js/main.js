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
    
    var volumeCenter = 70;
    
    var framesBetweenShift = 30;

    function init(){
    //set canvas context
        canvas = (typeof(G_vmlCanvasManager) != 'undefined') ? G_vmlCanvasManager.initElement($("canvas#card")[0]) : $("canvas#card")[0];
        ctx = canvas.getContext('2d');
        ctx.font = "20.0px Arial, Helvetica, sans-serif";
        container = $(canvas).parent();
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
    }
    
    function startDrawing(){
        $('button#play').hide();
        //intervalId = setInterval(draw, 10);
        
        //load the wav only if we need it, otherwise load the mp3
        if (typeof window.waapisimContexts != 'undefined'){
            loadSound("audio/home-grown-tomatoes.wav");
        } else {
            loadSound("audio/home-grown-tomatoes.mp3");
        }
    }

    //define plant1 image
    var plant1 = new Image();
    plant1.src = 'img/plant1.png';
    var plant1x = plant1x0 = 274;
    var plant1y = plant1y0 = 750-481;
    var plant1w;
    var plant1h;
    //set natural width and natural height once the image is loaded
    if (plant1.addEventListener){
        plant1.addEventListener('load', function(){
            plant1w = plant1.naturalWidth;
            plant1h = plant1.naturalHeight;
        }, false);
    } else if (plant1.attachEvent){
        plant1.attachEvent('onload', function(){
            plant1w = plant1.naturalWidth;
            plant1h = plant1.naturalHeight;
        });
    }

    //reset height and width
    $(window).resize(respondCanvas);

    function respondCanvas(){
        $(canvas).attr('width', $(container).width() );
        $(canvas).attr('height', $(window).height() );
        //call a function to redraw other content        
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
    respondCanvas();
});