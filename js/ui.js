export let gameStarted = false;
export let gamePaused = true;
export let isNight = false;

export function setGameStarted(value) {
    gameStarted = value;
}

export function setGamePaused(value) {
    gamePaused = value;
}

export function setIsNight(value) {
    isNight = value;
}

export function setupUI() {
    const startScreen = document.getElementById("startScreen");
    
    const instructionsScreen = document.getElementById("instructionsScreen");
    
    const levelIntro = document.getElementById("levelIntro");
    
    const inventoryBtn = document.getElementById("inventoryBtn");

    const dayCounter = document.getElementById("dayCounter");

    const harvestTracker = document.getElementById("harvestTracker");
    
    document.getElementById("startBtn").addEventListener("click", () => {
        startScreen.classList.add("fadeout");
        setTimeout(() => {
            startScreen.classList.add("hidden");
            levelIntro.classList.remove("hidden");
        }, 700);
    });
    
    document.getElementById("instructionsBtn").addEventListener("click", () => {
        startScreen.classList.add("hidden");
        instructionsScreen.classList.remove("hidden");
    });
    
    document.getElementById("backBtn").addEventListener("click", () => {
        instructionsScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    });
    
    document.getElementById("continueBtn").addEventListener("click", () => {
        levelIntro.classList.add("hidden");
        inventoryBtn.classList.remove("hidden");
        setGameStarted(true);
        setGamePaused(false);

        document.getElementById("timeBtn").classList.remove("hidden");

        dayCounter.classList.remove("hidden");
        harvestTracker.classList.remove("hidden");
    });
}
