import { levels } from './levels.js';

export let selectedItem = null;

const startingLevel = levels[1];

export const inventory = { ...startingLevel.startingInventory };
export const harvestedFlowers = {};
let inventoryLevel = startingLevel;

Object.keys(startingLevel.flowerGoal).forEach((flowerType) => {
    harvestedFlowers[flowerType] = 0;
});

export let inventoryOpen = false;

export function setupInventory() {
    const inventoryBtn = document.getElementById("inventoryBtn");
    
    const inventoryWindow = document.getElementById("inventoryWindow");
    
    const closeInventory = document.getElementById("closeInventory");
    
    inventoryBtn.addEventListener("click", () => {
        updateInventoryUI();
        inventoryWindow.classList.remove("hidden");
        inventoryOpen = true;
        });
    
    closeInventory.addEventListener("click", (event) => {
        event.stopPropagation();
        inventoryWindow.classList.add("hidden");
        inventoryOpen = false;
    });
    
    inventoryWindow.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    updateHarvestUI();
}

function formatItemName(itemType) {
    return itemType.charAt(0).toUpperCase() + itemType.slice(1) + "s";
}

function formatSeedName(seedType) {
    return seedType.charAt(0).toUpperCase() + seedType.slice(1);
}

export function resetInventoryForLevel(levelConfig) {
    selectedItem = null;
    inventoryLevel = levelConfig;

    Object.keys(inventory).forEach((itemType) => {
        delete inventory[itemType];
    });

    Object.entries(levelConfig.startingInventory).forEach(
        ([itemType, amount]) => {
            inventory[itemType] = amount;
        }
    );

    Object.keys(harvestedFlowers).forEach((flowerType) => {
        delete harvestedFlowers[flowerType];
    });

    getGoalTypes().forEach((flowerType) => {
        harvestedFlowers[flowerType] = 0;
    });

    updateInventoryUI();
    updateHarvestUI();
}

function getGoalTypes() {
    return Object.keys(inventoryLevel.flowerGoal || {});
}

export function addSeeds(seedType, amount) {
    inventory[seedType] = (inventory[seedType] || 0) + amount;
    updateInventoryUI();
}

export function addHarvestedFlower(flowerType, amount = 1) {
    harvestedFlowers[flowerType] =
        (harvestedFlowers[flowerType] || 0) + amount;

    updateHarvestUI();

    return harvestedFlowers[flowerType];
}

export function updateHarvestUI() {
    const container = document.getElementById("harvestItems");

    if (!container) return;

    container.innerHTML = "";

    getGoalTypes().forEach((flowerType) => {
        const goal = inventoryLevel.flowerGoal[flowerType];
        const item = document.createElement("div");

        item.classList.add("harvestItem");

        const amountText = harvestedFlowers[flowerType] + " / " + goal;

        item.innerHTML =
            "<span>" + formatItemName(flowerType) + "</span>" +
            "<strong>" + amountText + "</strong>";

        container.appendChild(item);
    });
}

export function updateInventoryUI() {
    const container = document.getElementById("inventoryItems");
    
    container.innerHTML = "";
    
    Object.entries(inventory).forEach(([seedType, amount]) => {
        if (amount <= 0) return;

        const item = document.createElement("div");
        
        item.classList.add("inventoryItem");
        
        if (selectedItem === seedType) {
            item.classList.add("selected");
        }
        
        item.innerHTML =
            formatSeedName(seedType) + " Seeds x" + amount;
        
        item.addEventListener("click", () => {
            selectedItem = seedType;
            updateInventoryUI();
        });
        
        container.appendChild(item);
    });
}
