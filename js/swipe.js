var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;

var gesuredZone = document.querySelector('body');

gesuredZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gesuredZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesure();
}, false); 

function handleGesure() {
    var currentSection = model.mode.currentSection;
    var newSection;
    var touchvectorX = touchendX - touchstartX;
    var touchvectorY = touchendY - touchstartY;

    var calcDistance = function() {
        var obj = {};
        obj.x = touchvectorX < 0 ? -touchvectorX : touchvectorX;
        obj.y = touchvectorY < 0 ? -touchvectorY : touchvectorY;
        return obj;
    }
    var distance = calcDistance();

    if (distance.x > distance.y) {
        if (touchendX < touchstartX) {
            newSection = (currentSection + 1)
        } else if (touchendX > touchstartX) {
            newSection = (currentSection - 1)        
        }
    }

    view.slideToSection(undefined,newSection)    
}