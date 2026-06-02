import * as THREE from 'three';

export function createMushroom(x, z) {
    const mushroom = new THREE.Group();

    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.65, 2.2, 16),
        new THREE.MeshStandardMaterial({
            color: 0xf1e3c8
        })
    );

    stem.position.y = 1.1;
    stem.castShadow = true;

    const cap = new THREE.Mesh(
        new THREE.SphereGeometry(1.45, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({
            color: 0xb64232
        })
    );

    cap.position.y = 2.15;
    cap.scale.set(1, 0.55, 1);
    cap.castShadow = true;

    mushroom.add(stem);
    mushroom.add(cap);

    mushroom.position.set(x, 0, z);
    mushroom.scale.set(2, 2, 2);

    return mushroom;
}

export function canGrowMushroom(tile, levelConfig) {
    const allowedTiles = levelConfig.allowedMushroomTiles;

    if (!allowedTiles) return true;

    return allowedTiles.some(([x, z]) =>
        tile.position.x === x &&
        tile.position.z === z
    );
}
