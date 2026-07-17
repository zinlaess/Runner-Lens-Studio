// @input float speed = 15.0 {"label": "Movement Speed"}

function onUpdate() {
    var transform = script.getSceneObject().getTransform();
    var currentPos = transform.getWorldPosition();
    

    var movement = new vec3(0, 0, script.speed * getDeltaTime());
    
    transform.setWorldPosition(currentPos.add(movement));
    
   
    if (currentPos.z > 50.0) { 
        script.getSceneObject().destroy();
    }
}

script.createEvent("UpdateEvent").bind(onUpdate);