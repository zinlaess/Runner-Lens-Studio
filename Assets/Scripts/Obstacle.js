var transform = null;
var spawnManagerScript = null;

function onStart() {
    transform = script.getSceneObject().getTransform();
    
    
    activeCollider = script.getSceneObject().getComponent("Physics.ColliderComponent");
    

    if (activeCollider) {
        activeCollider.onOverlapEnter.add(onOverlapEnter);
    }
}


script.init = function(managerScript) {
    spawnManagerScript = managerScript;
};

function onUpdate() {
    if (!transform) return;

    var currentSpeed = 150.0;
    
    if (spawnManagerScript && spawnManagerScript.currentSpeed !== undefined) {
        currentSpeed = spawnManagerScript.currentSpeed;
    }

    var pos = transform.getLocalPosition();
    transform.setLocalPosition(new vec3(pos.x, pos.y, pos.z + (currentSpeed * getDeltaTime())));
}

function onOverlapEnter(eventArgs) {
    var hitObject = eventArgs.overlap.collider.getSceneObject();
    
    if (hitObject.name === "ObstacleDestroyer") {
        script.getSceneObject().destroy();
        return;
    }

    var allScripts = hitObject.getComponents("Component.ScriptComponent");
    var damageApplied = false;

    for (var i = 0; i < allScripts.length; i++) {
        var currentScript = allScripts[i];
        if (currentScript && typeof currentScript.takeDamage === "function") {
            currentScript.takeDamage(1);
            damageApplied = true;
            break;
        }
    }

    if (damageApplied) {
        script.getSceneObject().destroy();
    }
}

script.createEvent("OnStartEvent").bind(onStart);
script.createEvent("UpdateEvent").bind(onUpdate);