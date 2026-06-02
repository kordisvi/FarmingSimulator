export const levels = {
    1: {
        number: 1,
        startingDay: 1,
        lastDay: 8,
        flowerGoal: {
            sunflower: 8
        },
        startingInventory: {
            sunflower: 5
        },
        allowedSunflowerTiles: [
            [-30, 50],
            [-10, 50],
            [10, 50],
            [30, 50],

            [-30, 70],
            [-10, 70],
            [10, 70],
            [30, 70]
        ],
        fences: [
            {
                startX: -40,
                startZ: 40,
                steps: 3,
                rotate: 0
            },
            {
                startX: -40,
                startZ: 100,
                steps: 4,
                rotate: 1
            },
            {
                startX: 40,
                startZ: 40,
                steps: 3,
                rotate: 0
            }
        ],
        nextLevel: 2,
        completionIntro: {
            title: "Congratulations!",
            message:
                "You collected enough sunflowers. You are now moving to Level 2, where mushrooms need shadow all day and violets need half a day of sun and half a day of shadow."
        }
    },
   
    2: {
        number: 2,
        startingDay: 1,
        lastDay: 8,
        startingInventory: {
            mushroom: 5,
            violet: 5,
            sunflower: 5
        },
        flowerGoal: {
            mushroom: 10,
            violet: 20 ,
            sunflower: 20
        },
        allowedSunflowerTiles: [
            [-30, 70],
            [-10, 70],
            [10, 70],
            [30, 70],
            [50, 70],
            [70, 70],
            [90, 70],

            [-30, 50],
            [-10, 50],
            [10, 50],
            [30, 50],
            [50, 50],
            [70, 50],
            [90, 50]
        ],
        allowedMushroomTiles: [
            [50, -50],
            [50, -30],
            [50, -10],
            [50, 10],

            [70, 10],
            [70, -10],
            [70, -30]
        ],
        allowedVioletTiles: [
            [-30, 90],
            [-10, 90],
            [10, 90],
            [30, 90],
            [50, 90],
            [70, 90],
            [90, 90],

            [50, 30],
            [70, 30],
            [90, 30],

            [90, 10],
            [90, -10],
            [90, -30],
            [90, -50],
            
            [70, -50]
        ],
        fences: [
            {
                startX: -40,
                startZ: 40,
                steps: 3,
                rotate: 0
            },
            {
                startX: -40,
                startZ: 100,
                steps: 4,
                rotate: 1
            },
            {
                startX: 40,
                startZ: 100,
                steps: 3,
                rotate: 1
            },
            {
                startX: 100,
                startZ: -60,
                steps: 8,
                rotate: 0
            },
            {
                startX: -40,
                startZ: -60,
                steps: 7,
                rotate: 1
            },
            {
                startX: -40,
                startZ: -60,
                steps: 5,
                rotate: 0
            }
        ],
        completionIntro: {
            title: "Harvest Complete!",
            message:
                "Yeehaw, farmer! You brought in a mighty fine harvest and delivered every mushroom, violet, and sunflower the village needed. More fields and fresh challenges are coming soon, because this is still the beta version!"
        }
    }
};

export function getNextLevel(levelConfig) {
    if (!levelConfig.nextLevel) return null;

    return levels[levelConfig.nextLevel];
}

export function getCompletionIntro(levelConfig) {
    return levelConfig.completionIntro;
}

export function areLevelGoalsComplete(levelConfig, harvestedFlowers) {
    return Object.entries(levelConfig.flowerGoal).every(
        ([flowerType, goal]) => harvestedFlowers[flowerType] >= goal
    );
}
