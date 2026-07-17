// @input Asset.ObjectPrefab obstaclePrefab {"label": "Obstacle Prefab"}
// @input Asset.ObjectPrefab coinPrefab     {"label": "Coin Prefab"}
// @input SceneObject[] spawnPoints         {"label": "Spawn Points"}
// @input float spawnInterval = 2.0
// @input float coinSpawnChance = 40.0 

// @input float minSpawnInterval = 0.8
// @input float difficultySpeed = 0.02

var timer = 0;
var currentSpawnInterval = script.spawnInterval; 

script.resetManager = function() {
    currentSpawnInterval = script.spawnInterval;
    timer = 0;
};

script.createEvent("OnStartEvent").bind(function() {
    script.resetManager();
});

function onUpdate() {
    if (currentSpawnInterval === undefined || currentSpawnInterval === null) {
        currentSpawnInterval = script.spawnInterval;
    }

    var dt = getDeltaTime();
    timer += dt;
    
    if (currentSpawnInterval > script.minSpawnInterval) {
        currentSpawnInterval -= script.difficultySpeed * dt;
        if (currentSpawnInterval < script.minSpawnInterval) {
            currentSpawnInterval = script.minSpawnInterval;
        }
    }

    if (timer >= currentSpawnInterval) {
        timer = 0;
        spawnRandomThing();
    }
}

function spawnRandomThing() {

    if (script.spawnPoints.length === 0) {
        return;
    }

    var randomIndex = Math.floor(Math.random() * script.spawnPoints.length);
    var spawnPoint = script.spawnPoints[randomIndex];
    
    if (!spawnPoint) {
        return;
    }

    var prefabToSpawn = null;
    var roll = Math.random() * 100;
    if (roll < script.coinSpawnChance) {
        prefabToSpawn = script.coinPrefab; 
    } else {
        prefabToSpawn = script.obstaclePrefab; 
    }

    if (prefabToSpawn) {
        var newObject = prefabToSpawn.instantiate(null); 
        var transform = newObject.getTransform();
        var spawnTransform = spawnPoint.getTransform();
        
        transform.setWorldPosition(spawnTransform.getWorldPosition());
        transform.setWorldRotation(spawnTransform.getWorldRotation());
        newObject.enabled = true;        
    }
}

script.createEvent("UpdateEvent").bind(onUpdate);