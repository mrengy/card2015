window.imgWidth;
window.imgHeight;

//array to hold character objects
window.character = [];
window.characterPosition;

$( document ).ready(function() {
    var sun0 = new Character('data:text/javascript;base64,', 12, 12);

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

        window.character.push(this);
        window.characterPosition = window.character.indexOf(this);

        //set natural width and natural height once the image is loaded
        if (this.imageObject.addEventListener){
            this.imageObject.addEventListener('load', function(){
                console.log('this.naturalWidth for '+this.src+' = '+this.naturalWidth);
                window.imgWidth = this.naturalWidth/2;
                window.imgHeight = this.naturalHeight/2;

                //set natural width and natural height to object
                window.character[characterPosition]['imageObject']['w'] = window.character[characterPosition]['imageObject']['w0'] = window.imgWidth;
                window.character[characterPosition]['imageObject']['h'] = window.character[characterPosition]['imageObject']['h0'] = window.imgHeight;

                //set initial x and y position
                window.character[characterPosition]['imageObject']['x'] = x;
                window.character[characterPosition]['imageObject']['y'] = y;
                console.log('w property for the sun0 object inside imageObject event listener = '+window.character[characterPosition]['imageObject']['w'])
                window.character[characterPosition]['imageObject']['w'] = window.imgWidth;

                drawCharacter(window.character[0]['imageObject'],window.character[0]['imageObject']['x'],window.character[0]['imageObject']['y'],window.character[0]['imageObject']['w'],window.character[0]['imageObject']['h']);
            });
        } else if (this.imageObject.attachEvent){
            this.imageObject.attachEvent('onload', function(){
                console.log('this.naturalWidth for '+this.src+' = '+this.naturalWidth);
                window.imgWidth = this.naturalWidth/2;
                window.imgHeight = this.naturalHeight/2;

                //set natural width and natural height to object
                window.character[characterPosition]['imageObject']['w'] = window.character[characterPosition]['imageObject']['w0'] = window.imgWidth;
                window.character[characterPosition]['imageObject']['h'] = window.character[characterPosition]['imageObject']['h0'] = window.imgHeight;

                //set initial x and y position
                window.character[characterPosition]['imageObject']['x'] = x;
                window.character[characterPosition]['imageObject']['y'] = y;
                console.log('w property for the sun0 object inside imageObject event listener = '+sun0['imageObject']['w'])
                window.character[characterPosition]['w'] = window.imgWidth;

                drawCharacter(window.character[0]['imageObject'],window.character[0]['imageObject']['x'],window.character[0]['imageObject']['y'],window.character[0]['imageObject']['w'],window.character[0]['imageObject']['h']);
            });
        }
    } //end object constructor

    function drawCharacter(name, x, y, w, h){
        ctx.drawImage(name, x, y, w, h);
    }

    console.log('w property for the sun0 object outside consturctor = '+window.character[characterPosition]['imageObject']['w']);
    
    init();
});