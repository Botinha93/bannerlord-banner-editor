var tempImg= new Image();
var startTime = +new Date();
var endTime;
var finalTime;

function benchmark(){
    tempImg.onload = function () {
        endTime = +new Date();
        finalTime=(endTime - startTime)*10
        tempImg.remove();
        startTime = +new Date();
        tempImg= new Image();
    }
    var div = document.getElementById('body');
    div.appendChild(tempImg)
}