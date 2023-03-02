
/**
 * @typedef {Object} command
 * @property {string} type
 * @property {Array} ids
 */
/**
 * @type {Array<command>}
 */
var commandlist =[]
var position = 0;

/**
 * @param {string} type 
 * @param {Array} ids 
 * @returns {command}
 */
function command(type,ids){
    this.type = type;
    this.ids = ids;
} 
function ctrlz(){
    switch (commandlist[position].type) {
        case 'copy':
            _undoCopyAdd();
            break;
        case 'move':
            _undoMove();
            break;
        case 'add':
            _undoCopyAdd();
            break;    
        case 'delete':
            _undoDel();
            break;
        case 'drag':
            _undoDrag();
            break;
        case 'color':
            _undoColor();
            break;   
        case 'img':
            _undoImg();
            break;   
        default:
            break;
    }
    function _undoCopyAdd(){
        var pop = commandlist.pop();
        var toremove = document.getElementsByClassName('selectedLayer');
        Array.from(toremove).forEach(element => {
            element.classList.remove('selectedLayer');
        });
        Array.from(pop.ids).forEach(cid => {
            document.getElementById(cid).classList.add('selectedLayer');
        });
        deleteLayer();
    }
    function _undoMove(){
        var pop = commandlist.pop();
        var toremove = document.getElementsByClassName('selectedLayer');
        Array.from(toremove).forEach(element => {
            element.classList.remove('selectedLayer');
        });
        Array.from(pop.ids).forEach(cid => {
            document.getElementById(cid.id).classList.add('selectedLayer');
        });
        var toedit = document.getElementsByClassName('selectedLayer');
        Array.from(toedit).forEach(element => {
            document.getElementById('x').valueAsNumber = pop.x;
            document.getElementById('y').valueAsNumber = pop.y;
            document.getElementById('w').valueAsNumber = pop.w;
            document.getElementById('h').valueAsNumber = pop.h;
            document.getElementById('p').valueAsNumber = pop.p;
        });
        getCoordinates();
    }
    function _undoDrag(){
        var pop = commandlist.pop();
    }
}