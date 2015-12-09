$( document ).ready(function() {
    preloadCursors(); 
    $('audio#eel').trigger('load');
    var spotCounter = 1;
	var eelWidth=127;
	var eelHeight=127;

    $('#face-container').mousedown(function(event){
    	$(this).addClass('punching');
    	$(this).append($('#original-spot').clone().removeAttr('id').attr('id','spot-'+spotCounter).css('left', event.pageX - eelWidth).css('top', event.pageY - eelHeight));
    	$('audio#eel').trigger('play');
        spotCounter++;
    });
    $('#face-container').mouseup(function(){
    	$(this).removeClass('punching');
    });

    function preloadCursors(){
         // counter
         var i = 0;

         // create object
         imageObj = new Image();

         // set image list
         images = new Array();
         images[0]='img/cursor_eel_rotated.png';

         // start preloading
         for(i=0; i<=(images.length-1); i++) 
         {
              imageObj.src=images[i];
         }
    }
});