        var canvas = new fabric.Canvas('canvas');
        canvas.centeredScaling = true;
        canvas.backgroundColor = 'rgba(255,255,255,1)';
        var _orizoom = canvas.getZoom();
        var _lastheight = window.innerHeight;
        var Resize = function(){
            var size = (window.innerHeight - 45);
            if(window.innerHeight > (window.innerWidth*0.55)){
                size = window.innerWidth*0.55;
            }
            var zoom = ((size*100)/1528);
            if(_orizoom != canvas.getZoom()){
                canvas.zoomToPoint({ x: ((_lastheight -45)/2) , y: ((_lastheight -45)/2) },_orizoom);
            }
            canvas.setZoom((zoom/100))
            canvas.setWidth(size);
            canvas.setHeight(size);
            _orizoom = canvas.getZoom()
            _lastheight=window.innerHeight;
        }
        window.onresize = Resize;
        Resize();
        document.getElementById('myZoom').value = (canvas.getZoom()/2 )*100;
        document.getElementById('zoomText').textContent = document.getElementById('myZoom').value + "% ("+toFixed(canvas.getZoom(),2)+"°)";
        layers.push(new imgObject.layer(new load.newImage('1.png'),'1.png','background',false,'background'));
        setTimeout(function(){
            layers[0].canvasIMG.scaleToHeight(1528);
            layers[0].listElement().draggable = false;
            layers[0].canvasIMG.selectable = false;
        },100);
        changeColors(layers[layers.length-1].image);

        const overlay = new fabric.Rect({ width: 1200, height: 740,selectable:false,hasControls:false, fill: 'rgba(0,0,0,0)', stroke: 'rgba(77,77,77,0.7)', strokeWidth: 4,  opacity: 1.0 });
        canvas.add(overlay);
        overlay.viewportCenter().setCoords();
        canvas.on("object:added", () => {
            overlay.bringToFront();
        })

        var addLayers = function(){
            layers.push(new imgObject.layer(new load.newImage('100.png')));
            changeColors(layers[layers.length-1].image);
        }
        function addGroup(e){
            var editev = {};
            var selected = null;
            editev.preventDefault = function(){};
            layers.push(new imgObject.layer(null,"","group"+id,true));
            if(document.getElementsByClassName('selectedLayer').length > 0){
                selected = Array.from(document.getElementsByClassName('selectedLayer'));
                Array.from(document.getElementsByClassName('selectedLayer')).every((element)=>{
                    if(element.lastChild.tagname != 'UL'){
                        editev.target = element;
                        drop(editev,[layers[layers.length-1].listElement()]);
                    }
                });

            }
            editev.target = layers[layers.length-1].listElement();
            drop(editev,selected);
        }
        function deleteLayer(){
            Array.from(document.getElementsByClassName('selectedLayer')).every((element)=>{
                if(element.id != 0 && element.lastChild.tagName != 'UL'){
                    var lay = imgObject.getLayerByListElement(element)
                    canvas.remove(lay.canvasIMG);
                    imgObject.deleteLayer(lay);
                }
                return true;
            });
            Array.from(document.getElementsByClassName('selectedLayer')).every((element)=>{
                if(element.id != 0){
                    if(element.lastChild.tagName == 'UL'){
                        imgObject.deleteLayer(imgObject.getLayerByListElement(element));
                    }
                    element.remove();
                }
                return true;
            });
            canvas.discardActiveObject();
        }
        function copy(){
            var groups = [];
            var lis =[];
            var completeuls =[];
            Array.from(document.getElementsByClassName('selectedLayer')).every((element)=>{
                if(element.id != 0){
                    if(element.lastChild.tagName == 'UL'){
                        groups.push(element);
                    }else{
                        lis.push(element);
                    }
                    element.classList.remove('selectedLayer');
                }
                return true;
            });
            console.log(groups)
            console.log(lis)
            if(groups.length>0){
                groups.forEach( (g)=>{
                    addGroup();
                    var addedgroup = layers[layers.length-1].listElement();
                    var fakeevent={};
                    fakeevent.target =layers[layers.length-1].listElement();
                    var layerslist =[];
                    fakeevent.preventDefault = function(){};
                    g.classList.remove('selectedLayer');
                    lis.every((l)=>{
                        if(l.dataset.group == 'group'+g.id){
                            _copy(imgObject.getLayerByListElement(l),fakeevent.target.dataset.group);
                            layerslist.push(layers[layers.length-1].listElement());
                            l.classList.remove('selectedLayer');
                        }else if(l.dataset.group == 'main'){
                            _copy(imgObject.getLayerByListElement(l),'main');
                            l.classList.remove('selectedLayer');
                        }
                        return true;
                    });
                    completeuls.push({base:g,added:addedgroup});
                    drop(fakeevent,layerslist)
                });
                completeuls.forEach( (g)=>{
                    completeuls.forEach( (t)=>{
                        if('group'+g.base.id == t.base.dataset.group && g.base.id != t.base.id){
                            var fakeevent={};
                            fakeevent.target = g.added;
                            fakeevent.preventDefault = function(){};
                            drop(fakeevent,[t.added]);
                        }
                    });
                });
            }else if(lis.length>0){
                Array.from(lis).forEach(element => {
                    _copy(imgObject.getLayerByListElement(element),'main');
                });
                refactorTree();
                canvas.requestRenderAll();
            }
            /**
             * 
             * @param {imgObject.layer} element 
             */
            function _copy(element,group){
                var img = new load.newImage(element.imageid);
                img.color1 = element.image.color1;
                img.color2 = element.image.color2;
                img.image = element.image.image;
                layers.push(new imgObject.layer(img,element.imageid,group,false,"Copy of "+element.name));
                layers[layers.length-1]._init()
                layers[layers.length-1].listElement().firstChild.src = layers[layers.length-1].image.image;
                var idl = layers.length-1;
                
                setTimeout(() => {
                    layers[idl].canvasIMG.left = (element.canvasIMG.left);
                    layers[idl].canvasIMG.top = (element.canvasIMG.top);
                    layers[idl].canvasIMG.width = (element.canvasIMG.width);
                    layers[idl].canvasIMG.height = (element.canvasIMG.height);
                    layers[idl].canvasIMG.rotate(element.canvasIMG.get('angle')); 
                    layers[idl].canvasIMG.setCoords();
                }, 50);
            }
        }
        var canvasObjonSelect = function(e) {
            var toremove = document.getElementsByClassName('selectedLayer');
            for(var i=0;i<toremove.length;i++){
                elementStateTogle(toremove[i]);
            };
            var imga = this;
            setTimeout(function(){
                var element = imgObject.getLayerByCanvasIMGElement(imga);
                element.listElement().classList.add('selectedLayer');
                document.getElementsByClassName('color1')[0].classList.replace(document.getElementsByClassName('color1')[0].classList[1],element.image.color1) ;
                document.getElementsByClassName('color2')[0].classList.replace(document.getElementsByClassName('color2')[0].classList[1],element.image.color2) ;
                setLayerIcon();
            },100);
        }
        function zoom(opt) {
            var size = (window.innerHeight - 45);
            var delta;
            var zoom;
            if(typeof opt != 'undefined'){
                delta = opt.e.deltaY;
                zoom = canvas.getZoom();
                zoom = (zoom - (delta/5000));
            }else{
                zoom = (document.getElementById('myZoom').value/100) *2;
            }
            if(zoom>0 && zoom<2){
                canvas.zoomToPoint({ x: (window.innerHeight - 45)/2, y: (window.innerHeight - 45)/2 }, zoom);
                document.getElementById('myZoom').value = (zoom/2) *100;
                document.getElementById('zoomText').textContent = document.getElementById('myZoom').value + "% ("+toFixed(zoom,2)+"°)";
            }
            if(typeof opt != 'undefined'){
                opt.e.preventDefault();
                opt.e.stopPropagation();
            }
        }
        canvas.on('mouse:wheel', zoom );
        
        /**
         * @type {fabric.Image} e.target
         * @param {fabric.Image} e.target
         */
        function getCoordinates(e){
                    /**
         * @type {fabric.Image} e.target
         **/
            var activeObject = canvas.getActiveObject();
            document.getElementById('x').valueAsNumber = Math.round(activeObject.left);
            document.getElementById('y').valueAsNumber = Math.round(activeObject.top);
            document.getElementById('w').valueAsNumber = Math.round(activeObject.width * activeObject.scaleX);
            document.getElementById('h').valueAsNumber = Math.round(activeObject.height * activeObject.scaleY);
            document.getElementById('p').valueAsNumber = Math.round(activeObject.get('angle')); 
            setTimeout(() => {
                if(document.getElementsByClassName('selectedLayer').length>1){
                    document.getElementById('stroke').disabled =true;
                }else{
                    document.getElementById('stroke').disabled =false;
                    document.getElementById('stroke').checked = imgObject.getLayerByListElement(document.getElementsByClassName('selectedLayer')[0]).image.stroke;
                }
            }, 100);

            resetFlip();
        }
        canvas.on('object:scaling', getCoordinates);
        canvas.on('object:moving', getCoordinates);
        canvas.on('object:rotating', getCoordinates);
        canvas.on('selection:updated', getCoordinates);

        function canvasChangePos(e){
            if(document.getElementById('x').value != "" ){
                var activeObject = canvas.getActiveObject()
                activeObject.left = document.getElementById('x').valueAsNumber;
                activeObject.top = document.getElementById('y').valueAsNumber ;
                activeObject.width = document.getElementById('w').valueAsNumber; 
                activeObject.height = document.getElementById('h').valueAsNumber; 
                activeObject.rotate(document.getElementById('p').valueAsNumber);
                activeObject.setCoords();
                canvas.renderAll();
            }
        }
        function flip(pos=''){
            if(document.getElementsByClassName('selectedLayer').length>0){
                canvas.getActiveObject().centeredRotation = true;
                if(pos =='x'){
                    if(canvas.getActiveObject().flipX)
                        canvas.getActiveObject().flipX = false;
                    else
                        canvas.getActiveObject().flipX = true;
                }else{
                    if(canvas.getActiveObject().angle < 180)
                        canvas.getActiveObject().rotate(canvas.getActiveObject().angle + 180);
                    else
                        canvas.getActiveObject().rotate(canvas.getActiveObject().angle - 180);
                }
                canvas.getActiveObject().setCoords();
                canvas.renderAll();
                getCoordinates();
            }
        }
        function resetFlip(){
            document.getElementById('flipx').checked = canvas.getActiveObject().flipX;
            document.getElementById('flipy').checked = false;
        }
        function stroke(){
            if(document.getElementsByClassName('selectedLayer').length==1){
                var img = imgObject.getLayerByListElement(document.getElementsByClassName('selectedLayer')[0]);
                img.image.stroke = document.getElementById('stroke').checked;
                changeColors(img.image);
            }
        }