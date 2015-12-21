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

    var musicStarted = false;
    var averageVolume = averageVolume2 = 0;
    
    var ctx;
    var WIDTH;
    var HEIGHT;
    var intervalId = 0;
    var frame = 0;
    
    var increment = 1;
    
    var volumeCenter = 70;
    
    var framesBetweenShift = 30;

    //set canvas context
        //var canvas = (typeof(G_vmlCanvasManager) != 'undefined') ? G_vmlCanvasManager.initElement($("canvas#card")[0]) : $("canvas#card")[0];
        var canvas = $('canvas#card')[0];
        ctx = canvas.getContext('2d');
        ctx.font = "20.0px Arial, Helvetica, sans-serif";
        var container = $(canvas).parent();
        
    //reset height and width
    $(window).resize(respondCanvas);

    function respondCanvas(){
        $(canvas).attr('width', $(container).width() );
        $(canvas).attr('height', $(window).height() );
        //call a function to redraw other content        
    }

    //initial call to make the canvas respond
    respondCanvas();
});