var saveStates = []
var _finish;


var savef = function(){
    var s = JSON.stringify(new saveState());
	var blob = new Blob([s],{
        type: "text/plain"
      });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'banner.blb';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}
var loadf = function(){
    var input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = e => { 
        var file = e.target.files[0]; 
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
            document.getElementById('w8screen').style.display = "block";
            var content = readerEvent.target.result;
            var state = JSON.parse(content);
            loadState(state);
        }
    }
}
var saveState = function(){
    this.list = [];
    _dealList(document.getElementById('single').childNodes,this.list)
    function _dealList(ul, list = []){
        Array.from(ul).forEach((element)=>{
            var js = imgObject.getLayerByListElement(element).jsonFy();
            list.push({id:element.id,cimg:js})
            if(element.lastChild.tagName == 'UL'){
                _dealList(document.getElementById(list[list.length-1].id).lastChild.childNodes, list);
            }
        })
    }
}

function loadState(sstate){
    canvas.remove(...canvas.getObjects())
    document.getElementById('single').innerHTML ="";
    id=0;
    layers =[];
    _load(sstate.list,0)
    _finish = setTimeout(_treeFromLayers, 50);
}
function _treeFromLayers(){
    var list = document.getElementById('single').childNodes;
    var uls = [];
    Array.from(list).forEach((element)=>{
        if(element.lastChild.tagName == 'UL'){
            uls.push(element);
        }
    });
    Array.from(uls).forEach((ul2)=>{
        var lis=[];
        Array.from(uls).forEach((ul1)=>{
            if('group'+ul2.id == ul1.dataset.group && ul1.id != ul2.id){
                lis.push(ul1)
            }
        });
        var faker = {};
        faker.preventDefault = function(){};
        faker.target = ul2
        drop(faker,lis);
    });
    Array.from(uls).forEach((ul)=>{
        var lis = []  
        list.forEach((child)=>{   
            
            if(child.dataset.isgroup == 'false' && child.dataset.group == 'group'+ul.id){
                lis.push(child);
            }
        })
        console.log(lis)  
        var faker = {};
        faker.preventDefault = function(){};
        faker.target = ul;
        drop(faker,lis);
    })
    setTimeout(()=>{
        layers[0].canvasIMG.selectable = false;
        document.getElementById('w8screen').style.display = "none";
    },100)
}
function _load(list,y){
    setTimeout(()=>{
        if(y<list.length){
            var unjsonified= "";
            try{
                unjsonified = JSON.parse(list[y].cimg)
            }catch{
                unjsonified = list[y].cimg
            }
            var temp = new imgObject.layer(new load.newImage('100.png'));
            temp.group =unjsonified.group;
            temp.id =unjsonified.id;
            temp.name =unjsonified.name;
            temp.isgroup =unjsonified.isgroup;
            if(temp.isgroup){
                temp.setEleement(true);
                layers[temp.id] = temp;
            }else{
                temp.imageid =unjsonified.imageid;
                temp.image.trace = unjsonified.image.trace;
                temp.image.background = unjsonified.image.background;
                temp.image.parent = unjsonified.image.parent;
                temp.image.imageID = unjsonified.image.imageID;
                temp.image.image = unjsonified.image.image;
                temp.image.color1 = unjsonified.image.color1;
                temp.image.color2 = unjsonified.image.color2;
                temp.image.stroke = unjsonified.image.stroke;
                fabric.util.enlivenObjects([unjsonified.canvasIMG], function(objects) {
                    objects.forEach(function(o) {
                        o.onSelect = canvasObjonSelect;
                        temp.setCanvasIMG(o);
                        canvas.add(o);
                        temp.setEleement();
                        layers[temp.id] = temp;
                    });
                    canvas.renderAll();
                });
            }
            window.clearTimeout(_finish);
            _finish = setTimeout(_treeFromLayers, 50);
            y = y+1;
            _load(list,y);
        }
    },1,list,y)
}

function encode(s) {
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        var i, l;
        for (i = 1, l = data.length; i < l; i++) {
            currChar = data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (i = 0, l = out.length; i < l; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    }
function decode(s) {
        var dict = {};
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        for (var i = 1; i < data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            }
            else {
                phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    }