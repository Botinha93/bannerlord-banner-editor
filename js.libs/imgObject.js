/**
 * @typedef {object} imgObject.layer
 * @property {string} name - Indicates whether the Courage component is present.
 * @property {number} id - Indicates whether the Power component is present.
 * @property {string} imageid - Indicates whether the Wisdom component is present.
 * @property {object<load.newImage>} image - Indicates whether the Courage component is present.
 * @property {string} group - Indicates whether the Power component is present.
 * @property {string} imageid - Indicates whether the Wisdom component is present.
 * @property {HTMLElement} listElement - Indicates whether the Courage component is present.
 * @property {fabric.Image} canvasIMG - Indicates whether the Power component is present.
 * @property {function} setName - Indicates whether the Power component is present.
 * @property {function} jsonFy if stroke
 * @property {function} setCanvasIMG
 */
var id = 0;
/**
 * @type {HTMLCollection<HTMLElement>}
 */
var rootLayers = document.getElementById('layers').getElementsByTagName('ul')[0];
/**
 * @type {Array<imgObject.layer>}
 */
var layers = [] ;
/**
 * My namespace.
 * @namespace 
 */
var imgObject = {
    /**
     * @param {load.newImage} image
     * @param {string} imageid 
     * @param {string} group 
     * @param {string} name 
     * @param {Boolean} isgroup  
     * @returns {imgObject.layer}
     */
        layer : function (image,imageid = "100.png", group="main",isgroup = false, name = (isgroup ? "Goup "+id : "Layer "+id) ){
            this.name = name;
            this.id = id;
            this.isgroup =isgroup;
            this.group = group;
            this.canvasIMG = "";
            if(isgroup){
                rootLayers.insertAdjacentHTML('beforeend', "<li data-group=\""+this.group+"\" data-isgroup=\""+this.isgroup+"\" data-position-id=\""+this.id+"\" draggable=\"true\" onmousedown=\"SelectLI(event,this)\" ondragstart=\"drag(event)\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\" id=\"" + this.id + "\"><img  src=\"icons/group.svg\" draggable=\"false\" ><text>" + this.name + "</text><div onclick=\"expandable(event)\" class=\"expand\">⬙</div><ul></ul></li>");
                this.listElement = rootLayers.lastChild;
            }else{
                image.updateParent(id);
                this.image = image;
                this.imageid = imageid;
                this._init=() =>{
                    var tempimage = new fabric.Image();
                    tempimage.setSrc(this.image.image, function (obj) {
                        tempimage.onSelect = canvasObjonSelect;
                        setTimeout(function(){ canvas.add(tempimage)},50);
                    });
                    
                    rootLayers.insertAdjacentHTML('beforeend', "<li data-group=\""+this.group+"\" data-isgroup=\""+this.isgroup+"\" data-position-id=\""+this.id+"\" draggable=\"true\" onmousedown=\"SelectLI(event,this)\" ondragstart=\"drag(event)\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\" id=\"" + this.id + "\"><img  src=\"ui_bannericons/" + this.imageid + "\" draggable=\"false\" ><text>" + this.name + "</text></li>");
                    this.canvasIMG = tempimage;
                }
                
            };
            this.listElement = () =>{
                return document.getElementById(this.id);
            }
            id++;
            /**
             * @returns {String} Json reprsetation
             */
            this.jsonFy = ()=>{
                if(this.isgroup){
                    return JSON.stringify(this);
                }else{
                    var tempimg = this.canvasIMG;
                    this.canvasIMG = tempimg.toJSON();
                    var js = JSON.stringify(this);
                    this.canvasIMG =tempimg;
                    return js;
                }
            }
            /**
             * @function
             * @param {string} name New name
             */
            this.setName =(name = "Layer id")=>{
                this.name = name;
            };
            this.setEleement = (g=false)=>{
                if(!g)
                    rootLayers.insertAdjacentHTML('beforeend', "<li data-group=\""+this.group+"\" data-isgroup=\""+this.isgroup+"\" data-position-id=\""+this.id+"\" draggable=\"true\" onmousedown=\"SelectLI(event,this)\" ondragstart=\"drag(event)\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\" id=\"" + this.id + "\"><img  src=\"" + this.image.image + "\" draggable=\"false\" ><text>" + this.name + "</text></li>");
                else
                    rootLayers.insertAdjacentHTML('beforeend', "<li data-group=\""+this.group+"\" data-isgroup=\""+this.isgroup+"\" data-position-id=\""+this.id+"\" draggable=\"true\" onmousedown=\"SelectLI(event,this)\" ondragstart=\"drag(event)\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\" id=\"" + this.id + "\"><img  src=\"icons/group.svg\" draggable=\"false\" ><text>" + this.name + "</text><div onclick=\"expandable(event)\" class=\"expand\">⬙</div><ul></ul></li>");
            };
            this.setCanvasIMG = (canvasIMG) =>{
                this.canvasIMG = canvasIMG;
            }
            

        },
        /**
         * 
         * @param {HTMLElement} elementFromListofLayers 
         * @returns {imgObject.layer}
         */
        getLayerByListElement : function(elementFromListofLayers){
            for(var i=0;i<layers.length;i++){
                if(layers[i] != null && layers[i].id == elementFromListofLayers.id){
                    return layers[i];
                }
            };
        },
                /**
         * 
         * @param {fabric.Image} IMG 
         * @returns {imgObject.layer}
         */
        getLayerByCanvasIMGElement:function (IMG){
            for(var i=0;i<layers.length;i++){
                if(layers[i] != null && canvas.getObjects().indexOf(layers[i].canvasIMG) == canvas.getObjects().indexOf(IMG)){
                    return layers[i];
                }
            }
        },
        /**
         * 
         * @param {fabric.Image} layer element From List of Layers
         */
        deleteLayer(layer){
            layers[layers.indexOf(layer)] = null;
        }
}