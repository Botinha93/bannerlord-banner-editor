var files = window.banners();
var mainWindowsImages = document.getElementById('imgselector');
var uls = []; 
var group = ""
uls[0] = document.createElement("ul");
Array.from(files).forEach(file => {
    if(file.length>6){
        if(file.slice(0,file.length-6) != group){
            group = file.slice(0,file.length-6)
            uls.push(document.createElement("ul"));
        }
        var li = document.createElement("li");
        li.id = file;
        li.innerHTML = "<img onclick=\"selectIMG(event)\" draggable=false src=\"./ui_bannericons/"+file+"\">"
        uls[uls.length-1].appendChild(li);
    }else{
        var li = document.createElement("li");
        li.id = file;
        li.innerHTML = "<img onclick=\"selectIMG(event)\" draggable=false src=\"./ui_bannericons/"+file+"\">"
        uls[0].appendChild(li);
    }
});
Array.from(uls).forEach(ul => {
    mainWindowsImages.appendChild(ul);
});
function clickIMG(e){
    var imgdispaly = document.getElementById('imgselector');
    if(imgdispaly.classList.contains('setdisplaynone')){
        imgdispaly.classList.remove('setdisplaynone');
    }else{
        imgdispaly.classList.add('setdisplaynone');
    }
}
function selectIMG(e){
    var tochange = document.getElementsByClassName('selectedLayer');
        Array.from(tochange).forEach(element => {
            if(element.lastChild.tagName != 'UL'){
                var currentlayer = imgObject.getLayerByListElement(element);
                currentlayer.imageid = e.target.parentElement.id;
                var newimg = new load.newImage(currentlayer.imageid);
                newimg.updateParent(currentlayer.id)
                newimg.image = currentlayer.image.image;
                currentlayer.image = newimg;
                setTimeout(()=>{
                    console.log(currentlayer);
                    changeColors(currentlayer.image);
                },500);
            }
    });
    clickIMG(e);
}
function updateImage(element,src){
            document.getElementById('image').src = src;
            element.firstChild.src = src;
            var currentcanvasimg = imgObject.getLayerByListElement(element); 
            currentcanvasimg.canvasIMG.setSrc(src);
            setTimeout(function(){
                canvas.renderAll(); 
            },100);
}