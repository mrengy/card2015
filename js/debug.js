$( document ).ready(function() {
    var imgWidth;
    var imgHeight;
    var sun0 = new Character('sun0', 1, 0);

    function init(){
    	//set canvas context
        canvas = (typeof(G_vmlCanvasManager) != 'undefined') ? G_vmlCanvasManager.initElement($("canvas#card")[0]) : $("canvas#card")[0];
        ctx = canvas.getContext('2d');
        ctx.font = "20.0px Arial, Helvetica, sans-serif";
        container = $(canvas).parent();

        respondCanvas();
    }

    function Character(name, x, y){
        //define the image object within the Character
        this.imageObject = new Image();
        this.imageObject.src = 'img/'+name+'.png';

        console.log(this.imageObject);
        console.log(this.imageObject.src);

        //set natural width and natural height once the image is loaded
        if (this.imageObject.addEventListener){
            this.imageObject.addEventListener('load', function(){
                console.log('this.naturalWidth for '+this.src+' = '+this.naturalWidth);
                window.imgWidth = this.naturalWidth/2;
                window.imgHeight = this.naturalHeight/2;
                console.log('imgWidth inside imageObject event listener for '+this.src+' = '+window.imgWidth);
                //console.log(imgWidth);
            });
        } else if (this.imageObject.attachEvent){
            this.imageObject.attachEvent('onload', function(){
                window.imgWidth = this.naturalWidth/2;
                window.imgHeight = this.naturalHeight/2;
            });
        }
        //set natural width and natural height to object
        this['w'] = this['w0'] = window.imgWidth;
        this['h'] = this['h0'] = window.imgHeight;

        //set initial x and y position
        this['x'] = x;
        this['y'] = y;
        
        console.log('imgWidth inside character constructor = '+window.imgWidth);
    }
});