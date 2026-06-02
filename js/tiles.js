import * as THREE from 'three';

export function createTiles(scene) {
    const tiles = [];
    const checkedTiles = [];
    const tileSize = 20;
    const farmBounds = {
        minX: -90,
        maxX: 130,
        minZ: -90,
        maxZ: 110
    };
    const visibleTilePadding = tileSize * 2;

    const plantedTexture =
        new THREE.TextureLoader().load('./textures/planted.png');
    plantedTexture.offset.set(40 / 1024, 40 / 1024);
    plantedTexture.repeat.set(940 / 1024, 939 / 1024);

    const tileGeometry =
        new THREE.PlaneGeometry(
            tileSize,
            tileSize
        );

    for (
        let tileX = farmBounds.minX - visibleTilePadding;
        tileX <= farmBounds.maxX + visibleTilePadding;
        tileX += tileSize
    ) {
        for (
            let tileZ = farmBounds.minZ - visibleTilePadding;
            tileZ <= farmBounds.maxZ + visibleTilePadding;
            tileZ += tileSize
        ) {
            const tileMaterial =
                new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    map: plantedTexture,
                    transparent: true,
                    opacity: 0
                });

            const tile =
                new THREE.Mesh(
                    tileGeometry,
                    tileMaterial
                );

            tile.receiveShadow = true;
            tile.rotation.x = -Math.PI / 2;
            tile.position.set(
                tileX,
                0.1,
                tileZ
            );

            tile.userData = {
                planted: false,
                x: tileX - tileSize / 2,
                z: tileZ - tileSize / 2,
                seedType: null,
                harvestCooldownNights: 0
            };

            scene.add(tile);
            tiles.push(tile);

            if (
                tile.position.x >= farmBounds.minX &&
                tile.position.x <= farmBounds.maxX &&
                tile.position.z >= farmBounds.minZ &&
                tile.position.z <= farmBounds.maxZ
            ) {
                checkedTiles.push(tile);
            }
        }
    }

    return {
        tiles,
        checkedTiles
    };
}

export function resetTiles(tiles, scene) {
    tiles.forEach((tile) => {
        if (tile.userData.plant) {
            scene.remove(tile.userData.plant);
        }

        tile.userData.planted = false;
        tile.userData.seedType = null;
        tile.userData.sunrisesPassed = 0;
        tile.userData.grown = false;
        tile.userData.plant = null;
        tile.userData.harvestCooldownNights = 0;

        tile.material.color.set(0xffffff);
        tile.material.opacity = 0;
    });
}
