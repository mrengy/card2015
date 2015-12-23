window.imgWidth;
window.imgHeight;

$( document ).ready(function() {
    var sun0 = new Character('data:text/javascript;base64,', 1, 0);

    function init(){
        //set canvas context
        canvas = (typeof(G_vmlCanvasManager) != 'undefined') ? G_vmlCanvasManager.initElement($("canvas#card")[0]) : $("canvas#card")[0];
        ctx = canvas.getContext('2d');
        ctx.font = "20.0px Arial, Helvetica, sans-serif";
        container = $(canvas).parent();
    }

    function Character(name, x, y){
        //define the image object within the Character
        this.imageObject = new Image();
        this.imageObject.src = name+'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAW0lEQVR42mL8//8/AzpgZGTcC6KBcs5wMRwK/0MVMsLEmLAoEmXAApiwiKUhaRJCltgLsQVsWwIQ/wTx0fBeRigD7B6Y24i1mj4Kn4KI7Uie2Y7FI8+B2AMgwABjRynfWgpcxQAAAABJRU5ErkJggg==';

        console.log(this.imageObject);
        console.log(this.imageObject.src);

        //set natural width and natural height once the image is loaded
        if (this.imageObject.addEventListener){
            this.imageObject.addEventListener('load', function(){
                console.log('this.naturalWidth for '+this.src+' = '+this.naturalWidth);
                window.imgWidth = this.naturalWidth/2;
                window.imgHeight = this.naturalHeight/2;
                console.log('imgWidth inside imageObject event listener for '+this.src+' = '+window.imgWidth);
                //set natural width and natural height to object
                this['w'] = this['w0'] = window.imgWidth;
                this['h'] = this['h0'] = window.imgHeight;

                //set initial x and y position
                this['x'] = x;
                this['y'] = y;
                console.log('w variable for this object inside event listener = '+this['w']);
                console.log('w variable for the sun0 object inside imageObject event listener = '+sun0['imageObject']['w'])
            });
        } else if (this.imageObject.attachEvent){
            this.imageObject.attachEvent('onload', function(){
                console.log('this.naturalWidth for '+this.src+' = '+this.naturalWidth);
                window.imgWidth = this.naturalWidth/2;
                window.imgHeight = this.naturalHeight/2;
                console.log('this imgWidth inside imageObject event listener for '+this.src+' = '+window.imgWidth);
                
            });
        }
    } //end object constructor
    console.log
    init();
});