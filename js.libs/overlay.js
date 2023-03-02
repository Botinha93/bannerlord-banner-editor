    /**
     * @function
     * @param {Event} event
     */
     var overlayEvent = function(event){
        overlayController(event.target.selectedIndex)
    }
    var overlayController = function(index){
        overlay.strokeWidth = 4;
        switch (index) {
            case 0:
                overlay.width = 1200;
                overlay.height = 740;
                overlay.viewportCenter().setCoords();
                break;
            case 1:
                overlay.width = 740;
                overlay.height = 1200;
                overlay.viewportCenter().setCoords();
                break;
            case 2:
                overlay.width = 700;
                overlay.height = 700;
                overlay.viewportCenter().setCoords();
                break;
            case 3:
                overlay.width = 700;
                overlay.height = 840;
                overlay.viewportCenter().setCoords();
                break;
            case 4:
                overlay.width = 700;
                overlay.height = 1000;
                overlay.viewportCenter().setCoords();
                break;
            case 5:
                overlay.strokeWidth = 0;
                overlay.viewportCenter().setCoords();
                break;
            default:
                break;
        }
    }