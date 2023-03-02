
function toFixed(num, fixed) {
    var re = Math.floor(num*(10^fixed))/100;
    return re;
}
window.document.onmouseup = function(e){
    if(canvas.getActiveObjects().length<1){
        var toremove = document.getElementsByClassName('selectedLayer');
        Array.from(toremove).forEach(element => {
            elementStateTogle(element);
        });
    }
    if(e.target.tagName == 'BODY' || e.target.tagName == 'HTML' ){
        var toremove = document.getElementsByClassName('selectedLayer');
        Array.from(toremove).forEach(element => {
            elementStateTogle(element);
        });
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }
    var img = document.getElementById('imgselector')
    var col = document.getElementById("ColorPicker")
    if(e.target.tagName == 'BODY' || e.target.tagName == 'CANVAS'){
        img.classList.add('setdisplaynone');
    }
    if(e.target.tagName == 'BODY' || e.target.tagName == 'CANVAS'){
        col.classList.add('setdisplaynone')
    }
}
window.document.onkeydown = function(e){
    if(e.which === 17) {
        ctrl_hold = true;
    }
    if(e.which === 16) {
        shift_hold = true;
    }
}
document.onkeyup = function(e){
    if(e.which === 17) {
        ctrl_hold = false;
    }
    if(e.which === 16) {
        shift_hold = false;
    }
}
/**
 * 
 * @param {Event} event 
 */
function expandable(event){
    event.preventDefault()
    if(event.target.parentNode.lastChild.style.display != 'grid'){
        event.target.parentNode.lastChild.style.display = 'grid';
    }else{
        event.target.parentNode.lastChild.style.display = 'none';
    }
};
function generateBannertext(){
    var teste = bannerlordFy();
    document.getElementById('bannerlordtext').value  = teste.substring(0,teste.length-1);
    document.activeElement.blur();
}

