// @input int maxLives = 3
// @input SceneObject gameOverScreen
// @input Component.InteractionComponent restartButton

// @input Component.ScriptComponent playerController
// @input Component.ScriptComponent obstacleManager
// @input Component.ScriptComponent scoreManager {"label": "Score Manager Script"}

// @input SceneObject mainCharacter
// @input SceneObject deathCharacter

// @input string deathClipName = "Death"

script.currentLives = 3;
var isDead = false;

var startPosition = null;
var startRotation = null;

function onRestartClicked() {

    if (script.deathCharacter) {
        script.deathCharacter.enabled = false;
    }
    if (script.gameOverScreen) {
        script.gameOverScreen.enabled = false;
    }

    if (script.playerController) {
        script.playerController.enabled = true;
    }
    
    if (script.obstacleManager) {
        script.obstacleManager.enabled = false;
        script.obstacleManager.enabled = true;

        var delayEvent = script.createEvent("DelayedCallbackEvent");
        delayEvent.bind(function() {
            if (script.obstacleManager && typeof script.obstacleManager.resetManager === "function") {
                script.obstacleManager.resetManager();
            }
        });
        delayEvent.reset(0.05);
    }

    var rootObject = script.getSceneObject(); 
    if (rootObject && startPosition) {
        
        var rootTransform = rootObject.getTransform();
        rootTransform.setWorldPosition(startPosition);
        rootTransform.setWorldRotation(startRotation);
        
        if (script.mainCharacter) {
            script.mainCharacter.enabled = true;
        }

        if (script.playerController && typeof script.playerController.resetToCenter === "function") {
            script.playerController.resetToCenter();
        }
        
    }

    script.currentLives = script.maxLives ? script.maxLives : 3;
    isDead = false;

    if (script.scoreManager && typeof script.scoreManager.resetScore === "function") {
        script.scoreManager.resetScore();
    }
    
}

function onStart() {
    script.currentLives = script.maxLives ? script.maxLives : 3;
    isDead = false;
    
    if (script.mainCharacter && !startPosition) {
        var playerTransform = script.mainCharacter.getTransform();
        startPosition = playerTransform.getWorldPosition();
        startRotation = playerTransform.getWorldRotation();
    }

    if (script.gameOverScreen) {
        script.gameOverScreen.enabled = false;
    }
    if (script.deathCharacter) {
        script.deathCharacter.enabled = false;
    }
    
    if (script.mainCharacter) {
        script.mainCharacter.enabled = true;
    }
    
    if (script.restartButton) {
        script.restartButton.onTap.add(onRestartClicked);
    }
    
}

script.takeDamage = function(amount) {
    if (isDead) return;

    script.currentLives -= amount;

    if (script.currentLives <= 0) {
        die();
    }
};

function die() {
    isDead = true;
    
    if (script.playerController) {
        script.playerController.enabled = false;
    }
    if (script.obstacleManager) {
        script.obstacleManager.enabled = false;
    }

    if (script.mainCharacter && script.deathCharacter) {
        var playerTransform = script.mainCharacter.getTransform();
        var deathTransform = script.deathCharacter.getTransform();
        
        deathTransform.setWorldPosition(playerTransform.getWorldPosition());
        deathTransform.setWorldRotation(playerTransform.getWorldRotation());

        script.mainCharacter.enabled = false;

        script.deathCharacter.enabled = true;

        var animPlayer = script.deathCharacter.getComponent("Component.AnimationPlayer");
        if (animPlayer) {
            var clipToPlay = script.deathClipName ? script.deathClipName : "Death";
            if (typeof animPlayer.playClipAt === "function") {
                animPlayer.playClipAt(clipToPlay, 0.0);
            }
        }

    }

    var delayEvent = script.createEvent("DelayedCallbackEvent");
    delayEvent.bind(function() {
        if (script.gameOverScreen) {
            script.gameOverScreen.enabled = true;
        }
    });
    delayEvent.reset(2.0);
}

script.createEvent("OnStartEvent").bind(onStart);