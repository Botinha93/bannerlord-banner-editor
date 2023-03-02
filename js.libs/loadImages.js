

var loadedImages = []; 
  /**
   * @typedef {object} load.newImage
   * @param {string} image  image name in ui_bannericons
   * @param {imgObject.layer} parent this object parent
   * @property {string} trace image trace src
   * @property {string} background image background src
   * @property {string} imageID image id "100.png"
   * @property {string} image computed image
   * @property {number} parent parent id
   * @property {string} color1 rgb(x,x,x) 
   * @property {string} color2 rgb(x,x,x) 
   * @property {boolean} stroke if stroke
   */

/**
 * My namespace.
 * @namespace load
 */
var load = {
    /**
     * 
     * @param {imgObject.layer} image 
     * @returns {load.newImage}
     */
    newImage : function(image){
        var src = _initial('ui_bannericons/'+image)
        this.trace = src[1];
        this.background = src[0];
        this.parent = -1;
        this.imageID = image;
        this.image = "";
        this.color1 = document.getElementsByClassName('color1')[0].classList[1];
        this.color2 = document.getElementsByClassName('color2')[0].classList[1];
        this.stroke = true;
        this.onColorChanged = (src) => {
          if(this.image === ""){
              this.image=src;
              layers[this.parent]._init();
          }else{
            this.image=src;
          }
          updateImage(layers[this.parent].listElement(),src);
        };
        this.updateParent = (parente) =>{
          this.parent = parente;
        };
        return this;
    },
    getImageByFileName : function(name) {
        for(var i=0;i<loadedImages.length;i++){
            if(loadedImages[i].image == name){
                return loadedImages[i];
            }
        }
    }
}
/**
 * @function
 * @ignore
 */
function _initial(imagestart) {
    conversor = document.createElement('canvas');;
    context = conversor.getContext('2d');
    var image = document.createElement('img');
    image.src=imagestart;
    conversor.width = image.naturalWidth;
    conversor.height = image.naturalWidth;
    context.drawImage(image, 0, 0);;
    var imageData = context.getImageData(0, 0, conversor.width, conversor.height);
    var data = imageData.data;
      var databg=new Uint8ClampedArray(data.length);
      var datatc=new Uint8ClampedArray(data.length);
      for (var i = 0; i < data.length; i+= 4) {
              if(data[i]<30 && data[i+3] > 180){
                datatc[i] = 33;
                datatc[i+1] = 31;
                datatc[i+2] = 31;
                datatc[i+3] = 255;
                databg[i] = 0;
                databg[i+1] = 0;
                databg[i+2] = 0;
                databg[i+3] = 0;
              }else if (data[i+3] < 180){
                datatc[i+3] = 0;
                databg[i+3] = 0;
                datatc[i+2] = 0;
                databg[i+2] = 0;
                datatc[i+1] = 0;
                databg[i+1] = 0;
                datatc[i] = 0;
                databg[i] = 0;
              }else{
                datatc[i] = 0;
                datatc[i+1] = 0;
                datatc[i+2] = 0;
                datatc[i+3] = 0;
                databg[i] = 169;
                databg[i+1] = 116;
                databg[i+2] = 53;
                databg[i+3] = 255;
              }
          
      }

      context.putImageData(new ImageData(databg,imageData.width, imageData.height), 0, 0);
      var src=[];
      src.push(conversor.toDataURL("image/png"));
      context.putImageData(new ImageData(datatc,imageData.width, imageData.height), 0, 0);
      src.push(conversor.toDataURL("image/png"));
      return src;
  }
