var colororder=['colorid19',
'colorid140',
'colorid139',
'colorid128',
'colorid127',
'colorid35',
'colorid40',
'colorid149',
'colorid111',
'colorid110',
'colorid109',
'colorid108',
'colorid3',
'colorid16',
'colorid104',
'colorid137',
'colorid134',
'colorid74',
'colorid73',
'colorid115',
'colorid22',
'colorid72',
'colorid13',
'colorid105',
'colorid141',
'colorid138',
'colorid152',
'colorid146',
'colorid12',
'colorid75',
'colorid76',
'colorid119',
'colorid103',
'colorid116',
'colorid81',
'colorid102',
'colorid77',
'colorid101',
'colorid100',
'colorid6',
'colorid106',
'colorid94',
'colorid133',
'colorid130',
'colorid67',
'colorid68',
'colorid69',
'colorid4',
'colorid86',
'colorid79',
'colorid71',
'colorid32',
'colorid33',
'colorid34',
'colorid112',
'colorid28',
'colorid90',
'colorid21',
'colorid18',
'colorid20',
'colorid129',
'colorid126',
'colorid2',
'colorid153',
'colorid88',
'colorid120',
'colorid10',
'colorid89',
'colorid24',
'colorid93',
'colorid151',
'colorid118',
'colorid145',
'colorid142',
'colorid53',
'colorid148',
'colorid48',
'colorid57',
'colorid1',
'colorid14',
'colorid58',
'colorid52',
'colorid54',
'colorid62',
'colorid49',
'colorid25',
'colorid56',
'colorid63',
'colorid50',
'colorid59',
'colorid64',
'colorid154',
'colorid124',
'colorid123',
'colorid82',
'colorid23',
'colorid61',
'colorid60',
'colorid150',
'colorid157',
'colorid91',
'colorid27',
'colorid30',
'colorid99',
'colorid97',
'colorid80',
'colorid29',
'colorid136',
'colorid135',
'colorid38',
'colorid92',
'colorid46',
'colorid117',
'colorid37',
'colorid36',
'colorid9',
'colorid125',
'colorid122',
'colorid156',
'colorid26',
'colorid155',
'colorid11',
'colorid0',
'colorid39',
'colorid7',
'colorid43',
'colorid45',
'colorid95',
'colorid15',
'colorid31',
'colorid41',
'colorid17',
'colorid5',
'colorid96',
'colorid47',
'colorid132',
'colorid131',
'colorid42',
'colorid44',
'colorid144',
'colorid143',
'colorid121',
'colorid113',
'colorid84',
'colorid114',
'colorid8',
'colorid85',
'colorid78',
'colorid70',
'colorid107',
'colorid65',
'colorid66',
'colorid147',
'colorid98',
'colorid87',
'colorid51',
'colorid83',
'colorid55'
]
var mainWindowsColors = document.getElementById('ColorPicker');
var currentItem = null;

for(var i = 0; i<158;i++){
    var li = document.createElement("li");
    li.classList.add(colororder[i]);
    li.onclick = function(e){selectColor(e)};
    mainWindowsColors.firstChild.appendChild(li);
}

function clickCOLOR(e){
    if(mainWindowsColors.classList.contains('setdisplaynone')){
        mainWindowsColors.classList.remove('setdisplaynone');
    }else{
        mainWindowsColors.classList.add('setdisplaynone');
    }
    if(!!e){
        currentItem = e.target;
    }
}
var selectColor = function(e){
    currentItem.classList.replace(currentItem.classList[1],e.target.classList[0])
    currentItem=null;
    clickCOLOR(null);
    var tochange = document.getElementsByClassName('selectedLayer');
    Array.from(tochange).forEach(element => {
        changeColors(imgObject.getLayerByListElement(element).image);
    });
}



var _loading=[]
var _iloading = 0;
/**
 * @function
 * @ignore
 */
function _changeColors(imagestart,image,image2) {
    var conversor;
    var context;
    conversor = document.createElement('canvas');;
    context = conversor.getContext('2d');
    conversor.width = image.naturalWidth;
    conversor.height = image.naturalHeight;
    context.drawImage(image, 0, 0);
    var bgdata = context.getImageData(0, 0, conversor.width, conversor.height);
    context.clearRect(0, 0, conversor.width, conversor.height);
    context.drawImage(image2, 0, 0);
    var tcdata = context.getImageData(0, 0, conversor.width, conversor.height);
    var color1=getComputedStyle(document.getElementsByClassName('color1')[0]).backgroundColor;
    var color2=getComputedStyle(document.getElementsByClassName('color2')[0]).backgroundColor;
    imagestart.color1=document.getElementsByClassName('color1')[0].classList[1];
    imagestart.color2=document.getElementsByClassName('color2')[0].classList[1];
    var data = startConvertion(color1, color2, bgdata.data, tcdata.data, imagestart.stroke)
    context.putImageData(new ImageData(data,conversor.width, conversor.height),0,0);
    var srcteste = conversor.toDataURL("image/png");
    return srcteste;
}
function changeColors(imagestart){
    var image = document.createElement('img');
    _loading[_iloading]={base : imagestart, img : image};
    image.dataset.idLoading = _iloading;
    _iloading++;
    image.onload = (e) =>{
        _2changeColors(e.target.dataset.idLoading);
    }
    image.src=imagestart.background;   
}
/**
 * @function
 * @ignore
 */
function _2changeColors(img){
    var image = document.createElement('img');
    image.dataset.idLoading = _loading[img].img.dataset.idLoading;
    image.onload = (e) =>{
        var idl =e.path[0].dataset.idLoading
        var src =_changeColors(_loading[idl].base, _loading[idl].img, e.path[0]);
        _loading[idl].base.onColorChanged(src);
    }
    image.src=_loading[img].base.trace; 

}
/**
 * @function
 * @ignore
 */
function startConvertion(color1, color2,bgdata, tcdata, stroke) {
    color1 = color1.replace(/ /g, '').replace('rgb(','').replace(')','').split(',');
    color2 = color2.replace(/ /g, '').replace('rgb(','').replace(')','').split(',');
    var data=new Uint8ClampedArray(tcdata.length);
    for (var i = 0; i < tcdata.length; i+= 4) {

        if(tcdata[i+3] == 0 && bgdata[i+3] == 255){
            data[i+3]=255
            data[i+2]=color1[2]
            data[i+1]=color1[1]
            data[i]=color1[0]
        }else if(tcdata[i+3] == 255 && bgdata[i+3] == 0 && stroke){
            data[i+2]=color2[2]
            data[i+1]=color2[1]
            data[i]=color2[0]
            data[i+3]=255
        }else{
            data[i+3]=0
            data[i+2]=0
            data[i+1]=0
            data[i]=0
        }
    }
    return data;
}


