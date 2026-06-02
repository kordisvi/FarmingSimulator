import {
    canGrowMushroom,
    createMushroom
} from './mushrooms.js';
import {
    canGrowSunflower,
    createSunflower
} from './sunflowers.js';
import {
    canGrowViolet,
    createViolet
} from './violets.js';

export function growPlant(tile, scene, activeLevel) {
    tile.userData.grown = true;

    if (tile.userData.seedType === "sunflower") {
        if (canGrowSunflower(tile, activeLevel)) {
            const sunflower = createSunflower(tile.position.x, tile.position.z);
            tile.userData.plant = sunflower;
            scene.add(sunflower);
        } else {
            clearFailedPlant(tile);
        }
    }

    if (tile.userData.seedType === "mushroom") {
        if (!canGrowMushroom(tile, activeLevel)) {
            clearFailedPlant(tile);
            return;
        }

        const mushroom = createMushroom(tile.position.x, tile.position.z);
        tile.userData.plant = mushroom;
        scene.add(mushroom);
    }

    if (tile.userData.seedType === "violet") {
        if (!canGrowViolet(tile, activeLevel)) {
            clearFailedPlant(tile);
            return;
        }

        const violet = createViolet(tile.position.x, tile.position.z);
        tile.userData.plant = violet;
        scene.add(violet);
    }
}

function clearFailedPlant(tile) {
    tile.userData.planted = false;
    tile.userData.grown = false;
    tile.userData.seedType = null;
    tile.userData.sunrisesPassed = 0;
    tile.userData.harvestCooldownNights = 0;

    tile.material.color.set(0xffffff);
    tile.material.opacity = 0;
}
