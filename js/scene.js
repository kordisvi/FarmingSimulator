import * as THREE from 'three';

import { GLTFLoader }
from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

import {
    inventory,
    harvestedFlowers,
    selectedItem,
    addHarvestedFlower,
    addSeeds,
    resetInventoryForLevel,
    updateInventoryUI,
    inventoryOpen
} from './inventory.js';

import {
    gameStarted,
    gamePaused,
    isNight,
    setGameStarted,
    setGamePaused,
    setIsNight
} from './ui.js';

import {
    areLevelGoalsComplete,
    getCompletionIntro,
    getNextLevel,
    levels
} from './levels.js';
import {
    createTiles,
    resetTiles
} from './tiles.js';
import {
    buildLevelFences
} from './fences.js';

import {
    tree0,
    tree1,
    tree2,
    tree3,
    tree4,
    tree5,
    tree8,
    tree9,
    tree10,
    tree11,
    tree12,
    tree13,
    tree14,
    tree15
} from './trees.js';

import {
    createWindmill
} from './windmill.js';

import { sign } from './sign.js';
import {
    shadowCloud,
    updateCloudShadow
} from './cloud.js';

import { growPlant } from './flowers/plants.js';

import { createLake } from './lake.js';

export function createScene() {

    // ---------------- SCENE ----------------
    const scene = new THREE.Scene();

    // ---------------- CAMERA ----------------
    const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );

    camera.position.set(100, 100, 100);
    camera.lookAt(scene.position);

    let angle0 = Math.PI / 4;
    let radius0 = 100 * Math.sqrt(2);

    function updateCamera() {

        camera.position.x = radius0 * Math.sin(angle0);
        camera.position.z = radius0 * Math.cos(angle0);

        camera.lookAt(0, 0, 0);
    }

    window.addEventListener('keydown', (event) => {

        switch(event.key) {

            case 'ArrowLeft':
                angle0 -= 0.05;
                break;

            case 'ArrowRight':
                angle0 += 0.05;
                break;

            case 'ArrowUp':
                radius0 -= 0.5;
                break;

            case 'ArrowDown':
                radius0 += 0.5;
                break;
        }

        updateCamera();
    });

    // ---------------- RENDERER ----------------
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    // ---------------- TEXTURES ----------------
    const textureLoader = new THREE.TextureLoader();

    const grassTexture = textureLoader.load(
        '../textures/grass.jpg',
        undefined,
        undefined,
        (err) => console.error(err)
    );

    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;

    grassTexture.repeat.set(50, 50);

    // ---------------- GRASS ----------------
    const grassGeometry =
        new THREE.PlaneGeometry(1000, 1000);

    const grassMaterial =
        new THREE.MeshLambertMaterial({
            map: grassTexture
        });

    const grass =
        new THREE.Mesh(grassGeometry, grassMaterial);

    grass.rotation.x = -Math.PI / 2;

    grass.receiveShadow = true;

    scene.add(grass);

    // ---------------- LIGHTS ----------------
    const ambientLight =
        new THREE.AmbientLight(0x9fb8d6, 1.2);

   scene.add(ambientLight);

    const sun =
        new THREE.DirectionalLight(0xfff3d0, 1.2);

    sun.position.set(-600, 200, 640);

    sun.castShadow = true;

    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;

    sun.shadow.camera.left = -420;
    sun.shadow.camera.right = 420;
    sun.shadow.camera.top = 420;
    sun.shadow.camera.bottom = -420;

    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 1200;

    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = 0.02;

    scene.add(sun);

    // ---------------- TILES ----------------
    const {
        tiles,
        checkedTiles
    } = createTiles(scene);

    let activeLevel = levels[1];

    // ---------------- RAYCASTER ----------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener("click", (event) => {

        if (!gameStarted || gamePaused || inventoryOpen) return;

        mouse.x =
            (event.clientX / window.innerWidth) * 2 - 1;

        mouse.y =
            -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects =
            raycaster.intersectObjects(checkedTiles);

        if (intersects.length > 0) {

            const tile = intersects[0].object;

            if (tile.userData.grown) {
                harvestFlower(tile);
                return;
            }

            if (!isNight) return;

            highlightTile(tile);
        }
    });

    function harvestFlower(tile) {
        const flowerType = tile.userData.seedType;

        if (!flowerType) return;

        if (tile.userData.plant) {
            scene.remove(tile.userData.plant);
        }

        addHarvestedFlower(flowerType);
        addSeeds(flowerType, 2);

        if (
            activeLevel.flowerGoal &&
            areLevelGoalsComplete(activeLevel, harvestedFlowers) &&
            !levelComplete
        ) {
            completeLevel();
        }

        tile.userData.planted = false;
        tile.userData.seedType = null;
        tile.userData.sunrisesPassed = 0;
        tile.userData.grown = false;
        tile.userData.plant = null;
        tile.userData.harvestCooldownNights = 1;

        tile.material.color.set(0xffffff);
        tile.material.opacity = 0.9;
    }

    function highlightTile(tile) {

        if (tile.userData.planted) return;
        if (tile.userData.harvestCooldownNights > 0) return;

        if (!selectedItem) {

            alert("Select seeds first!");

            return;
        }

        if (!inventory[selectedItem] || inventory[selectedItem] <= 0) {
            alert("No " + selectedItem + " seeds left!");
            return;
        }

        tile.material.color.set(0xffffff);

        tile.material.opacity = 0.9;

        tile.userData.planted = true;

        tile.userData.seedType = selectedItem;

        tile.userData.sunrisesPassed = 0;
        
        tile.userData.grown = false;
        
        inventory[selectedItem]--;

        updateInventoryUI();
    }

    // ---------------- MODELS ----------------
    const loader = new GLTFLoader();

    loader.load(
        '../models/farmhouse__low-poly.glb',

        (gltf) => {

            const farmhouse = gltf.scene;

            farmhouse.scale.set(8.5, 7, 7);

            farmhouse.position.set(
                -1.5,
                10,
                -11.5
            );

            farmhouse.traverse((child) => {

                if (child.isMesh) {

                    child.castShadow = true;
                }
            });

            scene.add(farmhouse);
        },

        undefined,

        (err) =>
            console.error(
                'Error loading farmhouse:',
                err
            )
    );



    loader.load(
        '../models/mountain_range.glb',

        (gltf) => {

            const mountainRanges = [
                {
                    position: [-480, -10, 0],
                    rotation: 0
                },
                {
                    position: [480, -10, 0],
                    rotation: Math.PI
                },
                {
                    position: [0, -10, -480],
                    rotation: Math.PI / 2
                },
                {
                    position: [0, -10, 480],
                    rotation: -Math.PI / 2
                }
            ];

            mountainRanges.forEach((range) => {

                const mountain_range = gltf.scene.clone();

                mountain_range.scale.set(50, 180, 980);

                mountain_range.position.set(...range.position);

                mountain_range.rotation.y = range.rotation;

                mountain_range.traverse((child) => {

                    if (child.isMesh) {

                        child.castShadow = false;

                        child.material.roughness = 1;
                        child.material.metalness = 0;
                    }
                });

                scene.add(mountain_range);
            });
        },

        undefined,

        (err) =>
            console.error(
                'Error loading mountain_range:',
                err
            )


    );

    loader.load(
        '../models/scarecrow.glb',

        (gltf) => {

            const scarecrow = gltf.scene;

            scarecrow.scale.set(0.28, 0.28, 0.28);

            scarecrow.position.set(50, -30, 40);

            scarecrow.rotation.y = 3 * Math.PI / 4;

            scarecrow.traverse((child) => {

                if (child.isMesh) {

                    child.castShadow = true;
                }
            });

            scene.add(scarecrow);
        }
    );

    loader.load(
        '../models/american_old_barn.glb',

        (gltf) => {

            const american_old_barn = gltf.scene;

            american_old_barn.scale.set(0.4, 0.34, 0.28);

            american_old_barn.position.set(160, 0, 50);

            american_old_barn.rotation.y = Math.PI / 2;

            american_old_barn.traverse((child) => {

                if (child.isMesh) {

                    child.castShadow = true;
                }
            });

            scene.add(american_old_barn);
        }
    );



    // ---------------- FENCES ----------------
    let levelFences = buildLevelFences(scene, activeLevel);

    // ---------------- HELPERS ----------------
    const gridHelper =
        new THREE.GridHelper(
            1000,
            50,
            0x000000,
            0x000000
        );

    scene.add(gridHelper);

    // ---------------- RESIZE ----------------
    window.addEventListener('resize', () => {

        camera.aspect =
            window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    });

    // ---------------- TIME BUTTON ----------------
    let angle = 0;
    let sunMultiplier = 1;
    let currentDay = activeLevel.startingDay;
    let levelFailed = false;
    let levelComplete = false;
    const dayCounter = document.getElementById("dayCounter");
    const levelFailedWindow = document.getElementById("levelFailedWindow");
    const levelCompleteWindow = document.getElementById("levelCompleteWindow");
    const levelCompleteTitle = document.getElementById("levelCompleteTitle");
    const levelCompleteText = document.getElementById("levelCompleteText");
    const restartBtn = document.getElementById("restartBtn");
    const nextLevelBtn = document.getElementById("nextLevelBtn");

    dayCounter.textContent = "Day " + currentDay;
    updateLevelCompleteMessage();

    restartBtn.addEventListener("click", () => {
        window.location.reload();
    });

    nextLevelBtn.addEventListener("click", () => {
        if (!activeLevel.nextLevel) {
            window.location.reload();
            return;
        }

        goToNextLevel();
    });

    function goToNextLevel() {
        const nextLevel = getNextLevel(activeLevel);

        if (!nextLevel) {
            window.location.reload();
            return;
        }

        levelCompleteWindow.classList.add("hidden");
        activeLevel = nextLevel;
        resetLevelCounters(nextLevel);
        resetTiles(tiles, scene);
        scene.remove(levelFences);
        levelFences = buildLevelFences(scene, nextLevel);
        angle = 0;
        sunMultiplier = 1;
        wasNight = isNight;
        dayCounterStarted = false;
        firstSunriseSkipped = false;
        setGameStarted(true);
        setGamePaused(false);
        levelComplete = false;
        updateLevelCompleteMessage();
    }

    function updateDayCounter() {
        dayCounter.textContent = "Day " + currentDay;
    }

    function resetLevelCounters(levelConfig) {
        currentDay = levelConfig.startingDay || 1;
        updateDayCounter();
        resetInventoryForLevel(levelConfig);
    }

    function updateLevelCompleteMessage() {
        const completionIntro = getCompletionIntro(activeLevel);

        levelCompleteTitle.textContent = completionIntro.title;
        levelCompleteText.textContent = completionIntro.message;
        nextLevelBtn.textContent = activeLevel.nextLevel ? "Continue" : "Restart";
    }

    function failLevel() {
        levelFailed = true;
        sunMultiplier = 1;
        setGamePaused(true);
        setGameStarted(false);
        levelFailedWindow.classList.remove("hidden");
    }

    function completeLevel() {
        levelComplete = true;
        sunMultiplier = 1;
        setGamePaused(true);
        setGameStarted(false);
        levelCompleteWindow.classList.remove("hidden");
    }

    document.getElementById("timeBtn").addEventListener("mousedown", () => {
        if (levelFailed || levelComplete) return;

        sunMultiplier = 30;
    });

    document.getElementById("timeBtn").addEventListener("mouseup", () => {
        sunMultiplier = 1;
    });
    
    // ---------------- ANIMATION ----------------
let wasNight = isNight;
let dayCounterStarted = false;
let firstSunriseSkipped = false;

function animate() {

    requestAnimationFrame(animate);

    if (gameStarted && !gamePaused) angle += 0.0025 * sunMultiplier;

    const sunXRadius = 600;
    const sunZRadius = 800;

    sun.position.set(
        sunXRadius * Math.cos(angle),
        270 * Math.sin(angle),
        sunZRadius * Math.sin(angle)
    );

    sun.lookAt(0, 0, 0);

    updateCloudShadow(sun);

    const dayColor =
        new THREE.Color(0x87ceeb);

    const nightColor =
        new THREE.Color(0x000022);

    const dayAmbientColor =
        new THREE.Color(0xbfd3e8);

    const nightAmbientColor =
        new THREE.Color(0x17264d);

    const dayFactor =
        Math.max(0, sun.position.y / 270);

    scene.background =
        nightColor.clone().lerp(
            dayColor,
            dayFactor
        );

    ambientLight.color =
        nightAmbientColor.clone().lerp(
            dayAmbientColor,
            dayFactor
        );

    ambientLight.intensity =
        0.2 + Math.pow(1 - dayFactor, 3) * 2.2;
    
    setIsNight(dayFactor < 0.2);    

    if (gameStarted && !gamePaused) {
        windmill0.userData.rotor.rotation.z += 0.04 * sunMultiplier;
    }

    if (gameStarted && !dayCounterStarted) {
        wasNight = isNight;
        dayCounterStarted = true;
    }

    if (gameStarted && dayCounterStarted && wasNight && !isNight) {
        if (!firstSunriseSkipped) {
            firstSunriseSkipped = true;
        }
        else {
            currentDay++;
            updateDayCounter();

            if (
                activeLevel.lastDay &&
                currentDay > activeLevel.lastDay &&
                !levelComplete
            ) {
                failLevel();
            }
            else {
                tiles.forEach((tile) => {
                    if (tile.userData.harvestCooldownNights > 0) {
                        tile.userData.harvestCooldownNights--;

                        if (tile.userData.harvestCooldownNights === 0) {
                            tile.material.color.set(0xffffff);
                            tile.material.opacity = 0;
                        }

                        return;
                    }

                    if (!tile.userData.planted) return;
                    if (tile.userData.grown) return;

                    tile.userData.sunrisesPassed++;

                    if (tile.userData.sunrisesPassed >= 2) {
                        growPlant(tile, scene, activeLevel);
                    }
                });
            }
        }
    }

    wasNight = isNight;

    sun.intensity = 1.5 * dayFactor;

    renderer.render(scene, camera);
}

scene.add(tree0);
scene.add(tree1);
scene.add(tree2);
scene.add(tree3);
scene.add(tree4);
scene.add(tree5);
scene.add(tree8);
scene.add(tree9);
scene.add(tree10);
scene.add(tree11);
scene.add(tree12);
scene.add(tree13);
scene.add(tree14);
scene.add(tree15);


const lake = createLake(-300, -150);
scene.add(lake);

const windmill0 = createWindmill();
scene.add(windmill0);
windmill0.position.set(-70, 0, 280);
windmill0.scale.set(5, 3, 5);
windmill0.rotation.y = 3 * Math.PI / 4;


scene.add(sign);
scene.add(shadowCloud);
animate();
}
