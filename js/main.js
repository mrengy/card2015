$( document ).ready(function() {
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