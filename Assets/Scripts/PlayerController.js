// @input Component.ScriptComponent animStateManager
// @input SceneObject player
// @input Physics.ColliderComponent collider
// @input float laneWidth = 15.0
// @input float speed = 10.0


// @input float jumpForce = 15.0  
// @input float gravity = -40.0   


let transform;
let targetX = 0;
let currentLane = 0;
let currentDir = 0;
let targetDir = 0;
let isInitialized = false;


let yVelocity = 0;       
let isGrounded = true;   
let startY = 0;          


let isSliding = false;
let slideTimer = 0;

script.createEvent("OnStartEvent").bind(function() {
    if (script.player) {
        transform = script.player.getTransform();
        targetX = transform.getLocalPosition().x;
        startY = transform.getLocalPosition().y;
        isInitialized = true;
    }
});

script.upSwipe = function() {
    
    if (isGrounded && !isSliding) {
        yVelocity = script.jumpForce; 
        isGrounded = false;
        
        
        if (script.animStateManager) {
            script.animStateManager.setTrigger("jump");
        }
    }
};

script.downSwipe = function() {
    
};

script.leftSwipe = function() {
    if (currentLane > -1) {
        currentLane--;
        targetX = currentLane * script.laneWidth;
        targetDir = -1; 
    }
};

script.rightSwipe = function() {
    if (currentLane < 1) {
        currentLane++;
        targetX = currentLane * script.laneWidth;
        targetDir = 1; 
    }
};

function onUpdate() {
    if (!isInitialized || !transform) return;

    
    let currentPos = transform.getLocalPosition();
    let dt = getDeltaTime();

    let newX = MathUtils.lerp(currentPos.x, targetX, dt * script.speed);

    let newY = currentPos.y;
    if (!isGrounded) {
        yVelocity += script.gravity * dt; 
        newY += yVelocity * dt;

        if (newY <= startY) {
            newY = startY;
            yVelocity = 0;
            isGrounded = true;
        }
    }


    transform.setLocalPosition(new vec3(newX, newY, currentPos.z));

    if (Math.abs(targetX - currentPos.x) < 0.1) {
        targetDir = 0;
    }
    
    currentDir = MathUtils.lerp(currentDir, targetDir, dt * script.speed);
    
    let animValue = (currentDir * 0.3) + 0.5; 
    
    if (script.animStateManager) {
        script.animStateManager.setParameter("direction", animValue);
    }
}

const updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

script.resetToCenter = function() {
    if (!transform) return;

    currentLane = 0;
    targetX = 0;
    targetDir = 0;
    currentDir = 0;

    yVelocity = 0;
    isGrounded = true;

    var currentPos = transform.getLocalPosition();
    transform.setLocalPosition(new vec3(0, startY, currentPos.z));

    if (script.animStateManager) {
        script.animStateManager.setParameter("direction", 0.5);
    }

};