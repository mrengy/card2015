var WIDTH;
var HEIGHT;
window.imgWidth;
window.imgHeight;

//array to hold character objects
window.character = [];
window.characterPosition;

$( document ).ready(function() {
    var sun0 = new Character('iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAW0lEQVR42mL8//8/AzpgZGTcC6KBcs5wMRwK/0MVMsLEmLAoEmXAApiwiKUhaRJCltgLsQVsWwIQ/wTx0fBeRigD7B6Y24i1mj4Kn4KI7Uie2Y7FI8+B2AMgwABjRynfWgpcxQAAAABJRU5ErkJggg==', 12, 12);
    var sun1 = new Character('R0lGODlhCgAKANUCAEKtP0StQf8AAG2/a97w3qbYpd/x3mu/aajZp/b79vT69MnnyK7crXTDcqraqcfmxtLr0VG0T0ivRpbRlF24Wr7jveHy4Pv9+53UnPn8+cjnx4LIgNfu1v///37HfKfZpq/crmG6XgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAIALAAAAAAKAAoAAAZIQIGAUDgMEASh4BEANAGAxRAaaHoYAAPCCZUoOIDPAdCAQhIRgJGiAG0uE+igAMB0MhYoAFmtJEJcBgILVU8BGkpEAwMOggJBADs=',0,0);

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
        this.imageObject.src = 'data:text/javascript;base64,'+name;

        window.character.push(this);
        window.characterPosition = window.character.indexOf(this);

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
                window.character[characterPosition]['imageObject']['x1'] = x;
                window.character[characterPosition]['imageObject']['y1'] = y;

                //set loaded property for the object once loading is done
                window.character[characterPosition]['imageObject']['loaded'] = true;
                
                console.log(characterPosition);
                console.log(window.character[characterPosition]['imageObject']);
                
                function imageLoaded(element, index, array){
                    return element['imageObject']['loaded'] == true;
                }

                //test whether every object in array has the image loaded
                if(character.every(imageLoaded)){
                    $('button#play').show();
                };
            });
        } else if (this.imageObject.attachEvent){
            this.imageObject.attachEvent('onload', function(){
                window.imgWidth = this.naturalWidth/2;
                window.imgHeight = this.naturalHeight/2;

                //set natural width and natural height to object
                window.character[characterPosition]['imageObject']['w'] = window.character[characterPosition]['imageObject']['w0'] = window.imgWidth;
                window.character[characterPosition]['imageObject']['h'] = window.character[characterPosition]['imageObject']['h0'] = window.imgHeight;

                //set initial x and y position
                window.character[characterPosition]['imageObject']['x1'] = x;
                window.character[characterPosition]['imageObject']['y1'] = y;

                //set loaded property for the object once loading is done
                window.character[characterPosition]['imageObject']['loaded'] = true;

                console.log(characterPosition);
                console.log(window.character[characterPosition]['imageObject']);

                function imageLoaded(element, index, array){
                    return element['imageObject']['loaded'] == true;
                }

                //test whether every object in array has the image loaded
                if(character.every(imageLoaded)){
                    $('button#play').show();
                };
            });
        }
    } //end object constructor

    function startDrawing(){
        $('button#play').hide();
        intervalId = setInterval(draw, 10);
    }

    function draw(){
        clear();
        
        //draw characters
        drawCharacter(window.character[0]['imageObject'],window.character[0]['imageObject']['x1'],window.character[0]['imageObject']['y1'],window.character[0]['imageObject']['w'],window.character[0]['imageObject']['h']);
        window.character[0]['imageObject']['x1'] ++;
        drawCharacter(window.character[1]['imageObject'],window.character[1]['imageObject']['x1'],window.character[1]['imageObject']['y1'],window.character[1]['imageObject']['w'],window.character[1]['imageObject']['h']);
        window.character[1]['imageObject']['x1'] ++;
    }

    function drawCharacter(name, x, y, w, h){
        ctx.drawImage(name, x, y, w, h);
    }

    function clear() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    
    init();
    $('button#play').on('click', startDrawing );
});