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
    var imgWidth;
    var imgHeight;

    //reusable character variables
    window.imgWidth;
    window.imgHeight;
    window.character = [];
    window.characterPosition;

    //load images
    var sun0 = new Character('sun0',0,0);

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

        window.character.push(this);
        window.characterPosition = window.character.indexOf(this);

        var imagesReady = false;

        //set natural width and natural height once the image is loaded
        //conditional used by Chrome
        if (this.imageObject.addEventListener){
            this.imageObject.addEventListener('load', function(){
                window.imgWidth = this.naturalWidth/2;
                window.imgHeight = this.naturalHeight/2;

                //set natural width and natural height to object
                window.character[characterPosition]['imageObject']['w'] = window.character[characterPosition]['imageObject']['w0'] = window.imgWidth;
                window.character[characterPosition]['imageObject']['h'] = window.character[characterPosition]['imageObject']['h0'] = window.imgHeight;

                //set initial x and y position
                window.character[characterPosition]['imageObject']['x'] = x;
                window.character[characterPosition]['imageObject']['y'] = y;

                //set loaded property for the object once loading is done
                window.character[characterPosition]['imageObject']['loaded'] = true;

                function imageLoaded(element, index, array){
                    return element['imageObject']['loaded'] == true;
                }

                console.log(character.every(imageLoaded));

                $('button#play').show();

                //drawCharacter(window.character[0]['imageObject'],window.character[0]['imageObject']['x'],window.character[0]['imageObject']['y'],window.character[0]['imageObject']['w'],window.character[0]['imageObject']['h']);
            });
        } else if (this.imageObject.attachEvent){
            this.imageObject.attachEvent('onload', function(){
                window.imgWidth = this.naturalWidth/2;
                window.imgHeight = this.naturalHeight/2;

                //set natural width and natural height to object
                window.character[characterPosition]['imageObject']['w'] = window.character[characterPosition]['imageObject']['w0'] = window.imgWidth;
                window.character[characterPosition]['imageObject']['h'] = window.character[characterPosition]['imageObject']['h0'] = window.imgHeight;

                //set initial x and y position
                window.character[characterPosition]['imageObject']['x'] = x;
                window.character[characterPosition]['imageObject']['y'] = y;

                //set loaded property for the object once loading is done
                window.character[characterPosition]['imageObject']['loaded'] = true;

                $('button#play').show();

                //drawCharacter(window.character[0]['imageObject'],window.character[0]['imageObject']['x'],window.character[0]['imageObject']['y'],window.character[0]['imageObject']['w'],window.character[0]['imageObject']['h']);
            });
        }
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
        
        //draw characters
        drawCharacter(window.character[0]['imageObject'],window.character[0]['imageObject']['x'],window.character[0]['imageObject']['y'],window.character[0]['imageObject']['w'],window.character[0]['imageObject']['h']);
        
    }

    //reset height and width
    //$(window).resize(respondCanvas);

    //not using this for now
    function respondCanvas(){
        $(canvas).attr('width', $(container).width() );
        $(canvas).attr('height', $(window).height() );

        //reset canvas width and height
        WIDTH = canvas.width;
        HEIGHT = canvas.height;

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