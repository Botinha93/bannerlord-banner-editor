var ctrl_hold = false;
var shift_hold = false;
var selectedElements = [];
var rootLayers = document.getElementById('layers').getElementsByTagName('ul')[0];

function SelectLI(event,ev){
    event.stopPropagation();
    rootLayers = document.getElementById('layers').getElementsByTagName('ul')[0];
    canvas.discardActiveObject();
    document.getElementById('x').value="";
    document.getElementById('y').value="";
    document.getElementById('w').value="";
    document.getElementById('h').value="";
    document.getElementById('p').value="";
    selectedElements = [];
    if(ctrl_hold){
        elementStateTogle(ev);
    }else if(shift_hold && document.getElementsByClassName('selectedLayer').length === 1){
        var firstelement = document.getElementsByClassName('selectedLayer')[0];
        var toremove = document.getElementsByClassName('selectedLayer');
        Array.from(toremove).forEach(element => {
            element.classList.remove('selectedLayer');
        });
        var allLI = rootLayers.getElementsByTagName('li');
        if(firstelement.dataset.positionId < ev.dataset.positionId){
            for(var i = firstelement.dataset.positionId; i<=ev.dataset.positionId; i++){
                if(allLI[i])
                    allLI[i].classList.add('selectedLayer');
            }
        }else{
            for(var i = ev.dataset.positionId; i<=firstelement.dataset.positionId; i++){
                if(allLI[i])
                     allLI[i].classList.add('selectedLayer');
            }
        }
    }else{
        var toremove = document.getElementsByClassName('selectedLayer');
        Array.from(toremove).forEach(element => {
            element.classList.remove('selectedLayer');
        });
        elementStateTogle(ev);
    }
    var toSelect = document.getElementsByClassName('selectedLayer');
    Array.from(toSelect).forEach(element => {
        if(element.lastChild.tagName != 'UL')
                selectedElements.push(imgObject.getLayerByListElement(element).canvasIMG);
    });
    if(typeof selectedElements[0] != 'undefined'){

        setLayerIcon();
        if(selectedElements.length==1){
            canvas.setActiveObject(selectedElements[0]);
        }else{
            var sel = new fabric.ActiveSelection(selectedElements, {
                canvas: canvas,
                });
            canvas.setActiveObject(sel);
        }
        canvas.requestRenderAll();
        getCoordinates(null);
    }
}
function setLayerIcon(){
    if(document.getElementsByClassName('selectedLayer').length == 1){
        document.getElementById('image').src = document.getElementsByClassName('selectedLayer')[0].firstChild.src;
    }else{
        document.getElementById('image').src = './icons/group.svg';
    }
}
/**
 * 
 * @param {HTMLElement} elment 
 */
function elementStateTogle(elment){

    if(elment.lastChild.tagName == 'UL'){
        var lis = elment.lastChild.childNodes
        Array.from(lis).forEach(element => {
            elementStateTogle(element);
        });
        if(!elment.classList.contains('selectedLayer')){
            elment.classList.add('selectedLayer');
        }
        else{
            elment.classList.remove('selectedLayer');
        }
    }else{
        if(!elment.classList.contains('selectedLayer')){
            elment.classList.add('selectedLayer');
        }
        else{
            elment.classList.remove('selectedLayer');
        }
    }
}
/* unecessary?*/
function removeclassname(element){
    if(element.classList.contains('selectedLayer')){
        element.classList.remove('selectedLayer');
    }
}
function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  function _sortDrop(all){
    var groups = [];
    var layersSelected = [];
    Array.from(all).reverse().forEach(element => {
        if(element.lastChild.tagName == 'UL')
            groups.push(element);
        else
            layersSelected.push(element);
    });
    var linot =[];
    Array.from(layersSelected).reverse().forEach(li => {
        var found = false;
        Array.from(groups).reverse().forEach(ul => {
            if(li.dataset.group == 'group'+ul.id ){
                found=true;
            }
        });
        if(li.id == 0) found=true;
        if(!found) linot.push(li);
    });
    var gnot = [];
    if(groups.length>1){
        Array.from(groups).reverse().forEach(ult => {
            var found = false;
            Array.from(groups).reverse().forEach(ul => {
                if((ult.dataset.group == ul.dataset.group || ult.dataset.group == 'group'+ul.id) && ult.id != ul.id){
                    if(ult.dataset.positionId > ul.dataset.positionId){
                        found = true;
                    }
                } 
            });
            if(!found) gnot.push(ult);
        });
    }
    else{ gnot = groups; }

    return {linot,gnot}
  }
  function drop(ev, all=null) {
      try{
        ev.preventDefault();
      }catch{}
    if(all == null){
        all = document.getElementsByClassName('selectedLayer');
    }
    var objr = _sortDrop(all);
    var gnot = objr.gnot;
    var linot =objr.linot;
    if(ev.target.tagName == 'LI' && ev.target.lastChild.tagName != 'UL'){ /*LI*/
        if(gnot.length>0 && linot.length>0){
            Array.from(all).reverse().forEach(mix => {
                if(linot.length>0) Array.from(linot).reverse().forEach(li => {
                    if(li.id == mix.id){
                        if(ev.target.dataset.group == 'background'){
                            li.dataset.group = 'main';
                        }else{
                            li.dataset.group = ev.target.dataset.group;
                        }
                        ev.target.parentNode.insertBefore(li,ev.target.nextSibling);
                    }
                });
                Array.from(gnot).reverse().forEach(ul => {
                    if(ul.id == mix.id){
                        if(ev.target.dataset.group == 'background'){
                            ul.dataset.group = 'main';
                        }else{
                            ul.dataset.group = ev.target.dataset.group;
                        }
                        ev.target.parentNode.insertBefore(ul,ev.target.nextSibling);
                    }
                });
            });
        }else if(linot.length>0){
            Array.from(linot).reverse().forEach(element => {
                if(ev.target.dataset.group == 'background'){
                    element.dataset.group = 'main';
                }else{
                    element.dataset.group = ev.target.dataset.group;
                }
                ev.target.parentNode.insertBefore(element,ev.target.nextSibling);
            });
        }else if(gnot.length>0){
            Array.from(gnot).reverse().forEach(element => {
                if(ev.target.dataset.group == 'background'){
                    element.dataset.group = 'main';
                }else{
                    element.dataset.group = ev.target.dataset.group;
                }
                ev.target.parentNode.insertBefore(element,ev.target.nextSibling);
            });
        }
    }else if(ev.target.parentNode.tagName == 'LI'  && ev.target.parentNode.lastChild.tagName != 'UL'){/*LI child*/
        if(gnot.length>0 && linot.length>0){
            Array.from(all).reverse().forEach(mix => {
                if(linot.length>0) Array.from(linot).reverse().forEach(li => {
                    if(li.id == mix.id){
                        if(ev.target.parentNode.dataset.group == 'background'){
                            li.dataset.group = 'main';
                        }else{
                            li.dataset.group = ev.target.parentNode.dataset.group;
                        }
                        ev.target.parentNode.parentNode.insertBefore(li,ev.target.parentNode.nextSibling);
                    }
                });
                Array.from(gnot).reverse().forEach(ul => {
                    if(ul.id == mix.id){
                        if(ev.target.parentNode.dataset.group == 'background'){
                            ul.dataset.group = 'main';
                        }else{
                            ul.dataset.group = ev.target.parentNode.dataset.group;
                        }
                        ev.target.parentNode.parentNode.insertBefore(ul,ev.target.parentNode.nextSibling);
                    }
                });
            });
        }else if(linot.length>0){
            Array.from(linot).reverse().forEach(element => {
                if(ev.target.parentNode.dataset.group == 'background'){
                    element.dataset.group = 'main';
                }else{
                    element.dataset.group = ev.target.parentNode.dataset.group;
                }
                ev.target.parentNode.parentNode.insertBefore(element,ev.target.parentNode.nextSibling);
            });
        }else if(gnot.length>0){
            Array.from(gnot).reverse().forEach(element => {
                if(ev.target.parentNode.dataset.group == 'background'){
                    element.dataset.group = 'main';
                }else{
                    element.dataset.group = ev.target.parentNode.dataset.group;
                }
                ev.target.parentNode.parentNode.insertBefore(element,ev.target.parentNode.nextSibling);
            });
        }
    }else if(ev.target.parentNode.lastChild.tagName == 'UL'){/*ul*/
        if(gnot.length>0 && linot.length>0){
            Array.from(all).reverse().forEach(mix => {
                Array.from(linot).reverse().forEach(li => {
                    if(li.id == mix.id){
                        li.dataset.group = 'group'+ev.target.parentNode.id;
                        imgObject.getLayerByListElement(li).group = 'group'+ev.target.id;
                        ev.target.parentNode.lastChild.appendChild(li);
                    }
                    });
                Array.from(gnot).reverse().forEach(ul => {
                    if(ul.id == mix.id){
                        ul.dataset.group = 'group'+ev.target.parentNode.id;
                        imgObject.getLayerByListElement(ul).group = 'group'+ev.target.id;
                        ev.target.parentNode.lastChild.appendChild(ul);
                    }
                });
            });
        }else if(linot.length>0){
            Array.from(linot).reverse().forEach(element => {
                element.dataset.group = 'group'+ev.target.parentNode.id;
                imgObject.getLayerByListElement(element).group = 'group'+ev.target.id;
                ev.target.parentNode.lastChild.appendChild(element);
            });
        }else if(gnot.length>0){
            Array.from(gnot).reverse().forEach(element => {
                element.dataset.group = 'group'+ev.target.parentNode.id;
                imgObject.getLayerByListElement(element).group = 'group'+ev.target.id;
                ev.target.parentNode.lastChild.appendChild(element);
            });
        }
    }else if(ev.target.lastChild.tagName == 'UL'){
        if(gnot.length>0 && linot.length>0){
            Array.from(all).reverse().forEach(mix => {
                Array.from(linot).reverse().forEach(li => {
                    if(li.id == mix.id){
                        li.dataset.group = 'group'+ev.target.id;
                        imgObject.getLayerByListElement(li).group = 'group'+ev.target.id;
                        ev.target.lastChild.appendChild(li);
                    }
                    });
                Array.from(gnot).reverse().forEach(ul => {
                    if(ul.id == mix.id){
                        ul.dataset.group = 'group'+ev.target.id;
                        imgObject.getLayerByListElement(ul).group = 'group'+ev.target.id;
                        ev.target.lastChild.appendChild(ul);
                    }
                });
            });
        }else if(linot.length>0){
            Array.from(linot).reverse().forEach(element => {
                element.dataset.group = 'group'+ev.target.id;
                imgObject.getLayerByListElement(element).group = 'group'+ev.target.id;
                ev.target.lastChild.appendChild(element);
            });
        }else if(gnot.length>0){
            Array.from(gnot).reverse().forEach(element => {
                element.dataset.group = 'group'+ev.target.id;
                imgObject.getLayerByListElement(element).group = 'group'+ev.target.id;
                ev.target.lastChild.appendChild(element);
            });
        }
    }
    var toremove = document.getElementsByClassName('selectedLayer');
    Array.from(toremove).forEach(element => {
        element.classList.remove('selectedLayer');
    });
    canvas.discardActiveObject();
    refactorTree();
  }
  function refactorTree(){
    rootLayers = document.getElementById('layers').getElementsByTagName('ul')[0];
    var lielements = rootLayers.getElementsByTagName('li');
    var counter = lielements.length-1;
    Array.from(lielements).reverse().forEach(element => {
        element.dataset.positionId = counter;
            canvas.sendToBack(imgObject.getLayerByListElement(element).canvasIMG);
            counter--;
        }
    );
  }