// Set the current amount of health and gems at the beginning of the game
let gemCount = 0;
let currentHealth = 3;

// Creating classes
class Object
{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    render() {
        if (this.x > 1000) {
            this.x = -150;
            this.speed = this.setSpeed();
        }
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Diamond extends Object
{
    constructor() {
        let x = Math.round(Math.random() * (9 - 5) + 5) * 100;
        let y = Math.round(Math.random() * (5 - 2) + 2) * 100 + 50;
        super(x, y);
        this.role = 'diamond';
        this.sprite = 'img/diamond.png';
    }
}

class Gems extends Object
{
    constructor(x, y) {
        super(x, y);
        this.sprite = 'img/score-diamond.png';
    }
}

class Health extends Object
{
    constructor() {
        let x = Math.round(Math.random() * (9 - 1) + 1) * 100;
        let y = Math.round(Math.random() * (5 - 2) + 2) * 100 + 50;
        super(x, y);
        this.role = 'health';
        this.sprite = 'img/life.png';
    }
}

class Lives extends Object
{
    constructor(x, y) {
        super(x, y);
        this.sprite = 'img/score-heart.png';
    }
}

class Treasure extends Object
{
    constructor() {
        let x = Math.round(Math.random() * (9 - 1) + 1) * 100;
        let y = 30;
        super(x, y);
        this.role = 'treasure';
        this.sprite = 'img/treasure.png';
    }
}

class Entity extends Object
{
    constructor(x, y) {
        super(x, y);
        this.speedMin = 200;
        this.speedMax = 600;
    }

    setSpeed() {
        return Math.random() * (this.speedMax - this.speedMin) + this.speedMin;
    }
}

class Cop extends Entity
{
    constructor(x, y){
        super(x, y);
        this.role = 'cop';
        this.speed = this.setSpeed();
        this.sprite = 'img/police.png';
    }

    update(dt) {
        this.x += this.speed * dt;
    }
}

class Thief extends Entity
{
    constructor(x, y, id){
        super(x, y);
        this.role = 'thief';
        this.speed = this.setSpeed();
        this.sprite = 'img/car' + id + '.png';
    }

    update(dt) {
        this.x += this.speed * dt;
    }
}

class Player extends Entity
{
    constructor(x, y){
        super(x, y);
        this.role = 'player';
        this.sprite = 'img/thief.png';
    }

    update(dt) {
        
    }

    // Player.handleInput() method
    handleInput(key) {
        switch (key) {
            case 'left':
                if ((this.x - 100) < 0) {
                    return;
                }
                this.x -= 100;
            break;
            case 'up':
                if ((this.y - 100) < 0) {
                    return;
                }
                this.y -= 100;
            break;
            case 'right':
                if ((this.x + 150) > 1000) {
                    return;
                }
                this.x += 100;
            break;
            case 'down':
                if ((this.y + 200) > 750) {
                    return;
                }
                this.y += 100;
            break;
            case 'Enter':
                if (event.keyCode === 13) {
                    document.getElementById("start-button").click();
                }
            break;
        }
    }
    reset() {
        this.x = 520;
        this.y = 630;
    }
}

// Score display at the top
function displayCurrentHealth() {
    ctx.font = "30px Skranji";
    ctx.fillText('×' + currentHealth, 80, 35);
}

function displayTitle() {
    ctx.font = "30px Skranji";
    ctx.fillText('Steal the Treasure', 380, 35);
    ctx.fillStyle = 'white';
}

function displayGemCount() {
    ctx.font = "30px Skranji";
    ctx.fillText('×' + gemCount, 940, 35);
}

// Collisions between player, enemy and objects
function checkCollisions() {
    let playerL = player.x + 20;
    let playerR = player.x + 80;
    let playerT = player.y + 30;
    let playerB = player.y + 10;
    
    allEnemies.forEach(function(enemy) {
        let enemyL = enemy.x + 10;
        let enemyR = enemy.x + 190;
        let enemyT = enemy.y + 20;
        let enemyB = enemy.y + 80;
       
        if (enemyL <= playerL && playerL <= enemyR && enemyT <= playerT && playerT <= enemyB) {
            if (enemy.role === 'cop') {
                currentHealth--;
                if (currentHealth === 0) {
                    gameOver(false);
                }
            } else {
                if (gemCount > 0) {
                    gemCount--;
                }
            }
            player.reset();
        }
    });

    objects.forEach(function(object, index) {
        let objectL = object.x + 10;
        let objectR = object.x + 90;
        let objectT = object.y + 10;
        let objectB = object.y + 90;
       
        if (objectL <= playerL && playerL <= objectR && objectT <= playerT && playerT <= objectB) {
            switch (object.role) {
                case 'health':
                    currentHealth++;
                    objects[index] = new Health();
                break;
                case 'diamond':
                    gemCount++;
                    objects[index] = new Diamond();
                break;
                case 'treasure':
                    gemCount += Math.round(Math.random() * (20 - 5) + 5);
                    objects[index] = new Treasure();
                    player.reset();

                    gameOver(true);
                break;
            }
        }
    });
}

// Starts the game on button click
document.querySelector('.start-button').addEventListener('click', startGame);

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
}

// Displays the end of the game messages for win or lose
function gameOver(isWinner) {
    if (isWinner) {
        document.querySelector('#game-over h1').innerText = 'Congratulations!';
        document.querySelector('#game-over div').innerText = 'You got the treasure!';
    } else {
        document.querySelector('#game-over h1').innerText = 'Oh, no...';
        document.querySelector('#game-over div').innerText = "Maybe you're lucky next time... thief! :)";
    }
    document.querySelector('#game-over').classList.add('visible');
}

// Resets the game after winning or losing it
document.querySelector('#game-over input').addEventListener('click', function() {
    gemCount = 0;
    currentHealth = 3;
    document.querySelector('#game-over').classList.remove('visible');
    resetEnemies();
    resetGems();
});

// Resets the enemies
function resetEnemies() {
    allEnemies.forEach(function(enemy, index) {
        allEnemies[index].x = -150;
    });
}

// Resets the gems
function resetGems() {
    objects.forEach(function(object, index) {
        switch (object.role) {
            case 'diamond':
                objects[index] = new Diamond();
            break;
            case 'health':
                objects[index] = new Health();
            break;
            case 'treasure':
                objects[index] = new Treasure();
            break;
        }
    });
}

// Instantiating the enemies, player, objects, lives and gems.
allEnemies = [
    new Cop(0, 130),
    new Cop(0, 230),
    new Thief(0, 330, 1),
    new Thief(0, 430, 2),
    new Thief(0, 530, 3)
];

player = new Player(520, 630);

objects = [
    new Diamond(),
    new Diamond(),
    new Health(),
    new Treasure()
];

lives = new Lives(10, 0);

gems = new Gems(870, 0);

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'Enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});