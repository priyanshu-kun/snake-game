// Game constants and globals
let inputDirection = {x: 0,y: 0}
const FOOD_SOUND = new Audio('../Assets/sounds/food.mp3')
const GAME_OVER_SOUND = new Audio("../Assets/sounds/gameover.mp3")
const MOVE_SOUND = new Audio("../Assets/sounds/move.mp3")
const MUSIC_SOUND = new Audio("../Assets/sounds/music.mp3")
// const SCORE = document.getElementById('score')
const BOARD = document.querySelector('.board')
let speed = 5
let lastPaintTime = 0
let snakeArray = [
    {x:2,y: 2}
]
let food = {x:4,y:6}
let score = 0;
let highScoreVal = 0;
let detectKeyHit = false;


const isCollide = (snakeArray) => {
    // if snake bite himself
    for(let i = 1; i < snakeArray.length; i++) {
        if(snakeArray[i].x === snakeArray[0].x && snakeArray[i].y === snakeArray[0].y) {
            return true
        }
    }
    // if snake got hit on wall
    if((snakeArray[0].x >= 18 || snakeArray[0].x <= 0) ||(snakeArray[0].y >= 18 || snakeArray[0].y <= 0)) {
        return true
    }
}

const gameEngine = () => {
    // part 1: updating the snake array and food
    if(isCollide(snakeArray)) {
        GAME_OVER_SOUND.play()
        MUSIC_SOUND.pause()
        inputDirection = {x: 0, y: 0}
        alert("Game Over...\nPress any key to play again!");
        snakeArray = [{x:13,y:15}]
        if(highScoreVal < score) {
            localStorage.setItem("highScore",score)
        }
        score = 0
        SCORE.innerHTML = `Score: ${score}`
        HIGH_SCORE.innerHTML = `High Score: ${localStorage.getItem("highScore")}`
        BOARD.innerHTML = ""
        BOARD.innerHTML = `<h1 id="popup">Press any key to start...</h1>`
        detectKeyHit = false
    }

    // if you have eaten the food, increment the score and regenerate the food

    if(snakeArray[0].y === food.y && snakeArray[0].x === food.x) {
        FOOD_SOUND.play()
        score++
        SCORE.innerHTML = `Score: ${score}`
        snakeArray.unshift({x: snakeArray[0].x + inputDirection.x,y: snakeArray[0].y + inputDirection.y})
        let a = 2
        let b = 16
        let randomFoodPosition = Math.round( a + (b-a) * Math.random())
        let isFoodOnSnake = snakeArray.find(e => e.x === randomFoodPosition && e.y === randomFoodPosition)

        // to prevent for food on snake
        while(isFoodOnSnake) {
            randomFoodPosition = Math.round( a + (b-a) * Math.random())
            isFoodOnSnake = snakeArray.find(e => e.x === randomFoodPosition && e.y === randomFoodPosition)
        }
        food = {x:randomFoodPosition,y: randomFoodPosition}
        console.log(food)
    }

    // moving the snake
    for (let i = snakeArray.length-2; i >= 0; i--) {
        snakeArray[i+1] = {...snakeArray[i]}
    }

    snakeArray[0].x += inputDirection.x
    snakeArray[0].y += inputDirection.y


    // part 2: render the snake and food
    // Display the snake
    if(detectKeyHit) {
        BOARD.innerHTML = ""
    }
    snakeArray.forEach((e,idx) => {
        let snakeElement = document.createElement("div")
        snakeElement.style.gridRowStart = e.y 
        snakeElement.style.gridColumnStart = e.x
        !idx ? snakeElement.classList.add('head'): snakeElement.classList.add('snake_body')
        BOARD.appendChild(snakeElement)
    })
    // Display the food
    let foodElement = document.createElement("div")
    foodElement.style.gridRowStart = food.y 
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    BOARD.appendChild(foodElement)
}


// Game functions
const main = (ctime) => {
    window.requestAnimationFrame(main)
    if((ctime - lastPaintTime)/1000 < 1/speed) {
        return
    } 
    lastPaintTime = ctime
    gameEngine()
}

let highScore = localStorage.getItem("highScore")
if(!highScore) {
    localStorage.setItem("highScore",JSON.stringify(0))
}
else {
    highScoreVal = JSON.parse(highScore)
    HIGH_SCORE.innerHTML = `High Score: ${highScoreVal}`
}

// Main logic starts from here
window.requestAnimationFrame(main)
window.addEventListener('keydown',e => {
    inputDirection = {x: 0,y: 1}
    MUSIC_SOUND.play()
    MOVE_SOUND.play()
    detectKeyHit = true
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp")
            inputDirection.x = 0
            inputDirection.y = -1
            break;
        case "ArrowDown":
            console.log("ArrowDown")
            inputDirection.x = 0
            inputDirection.y = 1
            break;
        case "ArrowLeft":
            console.log("ArrowLeft")
            inputDirection.x = -1
            inputDirection.y = 0
            break;
        case "ArrowRight":
            console.log("ArrowRight")
            inputDirection.x = 1
            inputDirection.y = 0
            break;
        default:
            break;
    }
})