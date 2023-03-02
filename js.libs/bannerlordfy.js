function bannerlordFy( c = null){
    var bannerString = "";
    if(c == null)
        c = document.getElementById("single").children;
    var i;
    for (i = 0; i < c.length; i++) {
        if(c[i].tagName == 'LI' && c[i].lastChild.tagName == 'UL'){
            bannerString = bannerString + bannerlordFy(c[i].lastChild.children);
        }else{
            var layer = imgObject.getLayerByListElement(c[i]);
            console.log(layer)
            bannerString = bannerString + layer.imageid.replace('.png','')+".";
            bannerString = bannerString + layer.image.color1.replace('colorid','')+".";
            bannerString = bannerString + layer.image.color2.replace('colorid','')+".";
            var w = Math.round(layer.canvasIMG.width * layer.canvasIMG.scaleX)
            bannerString = bannerString + w +".";
            var h = Math.round(layer.canvasIMG.height * layer.canvasIMG.scaleY);
            bannerString = bannerString + h +".";
            bannerString = bannerString + Math.abs(Math.round(layer.canvasIMG.left)+(w/2))+".";
            bannerString = bannerString + Math.abs(Math.round(layer.canvasIMG.top)+(h/2))+".";
            if(layer.image.stroke){
                bannerString = bannerString+"1.";
            }else{
                bannerString = bannerString+"0.";
            }
            if(layer.canvasIMG.flipX){
                bannerString = bannerString+"1.";
            }else{
                bannerString = bannerString+"0.";
            }
            bannerString = bannerString + Math.round(layer.canvasIMG.get('angle'))+".";
        }
    }
    return bannerString;
}