// @input Component.Text scoreText {"label": "Score Text UI"}

var score = 0;

function onStart() {
    score = 0;
    updateScoreText();
    
    global.scoreManager = script;
}

script.addScore = function(amount) {
    score += amount;
    updateScoreText();
};

script.resetScore = function() {
    score = 0;
    updateScoreText();
};

function updateScoreText() {
    if (script.scoreText) {
        script.scoreText.text = " " + score;
    }
}

script.createEvent("OnStartEvent").bind(onStart);