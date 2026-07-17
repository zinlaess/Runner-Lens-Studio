// @input Asset.ObjectPrefab obstaclePrefab {"label": "Obstacle Prefab"}
// @input Asset.ObjectPrefab coinPrefab     {"label": "Coin Prefab"}

// @input SceneObject[] spawnPoints         {"label": "Spawn Points"}
// @input float spawnInterval = 2.0

// @input float coinSpawnChance = 40.0 

var timer = 0;

function onUpdate() {
    timer += getDeltaTime();
    if (timer >= script.spawnInterval) {
        timer = 0;
        spawnRandomThing();
    }
}

function spawnRandomThing() {
    if (script.spawnPoints.length === 0) return;

    var randomIndex = Math.floor(Math.random() * script.spawnPoints.length);
    var spawnPoint = script.spawnPoints[randomIndex];
    
    var prefabToSpawn = null;

    var roll = Math.random() * 100;
    if (roll < script.coinSpawnChance) {
        prefabToSpawn = script.coinPrefab; 
    } else {
        prefabToSpawn = script.obstaclePrefab; 
    }

    if (prefabToSpawn) {

        var newObject = prefabToSpawn.instantiate(spawnPoint.getParent());
        
        var transform = newObject.getTransform();
        var spawnTransform = spawnPoint.getTransform();
        
        transform.setWorldPosition(spawnTransform.getWorldPosition());
        transform.setWorldRotation(spawnTransform.getWorldRotation());
    }
}

script.createEvent("UpdateEvent").bind(onUpdate);