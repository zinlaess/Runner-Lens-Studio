// @input int pointsToAdd = 10 {"label": "Points Value"}


function onOverlapEnter(eventArgs) {
    
    var overlappedObj = eventArgs.overlap.collider.getSceneObject();
    
    
    if (overlappedObj.name === "Player" || overlappedObj.name === "Main_character") {

        if (global.scoreManager) {
            global.scoreManager.addScore(script.pointsToAdd);
        } 
        
       
        script.getSceneObject().destroy();
    }
}


var trigger = script.getSceneObject().getComponent("Physics.ColliderComponent");
if (trigger) {
    trigger.onOverlapEnter.add(onOverlapEnter);
} 