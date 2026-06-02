import * as THREE from 'three';

export function createSunflower(x, z) {
    const sunflower = new THREE.Group();

    // Stem
    const stemGeometry =
        new THREE.CylinderGeometry(0.25, 0.35, 8, 12);

    const stemMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2e7d32
        });

    const stem =
        new THREE.Mesh(stemGeometry, stemMaterial);

    stem.position.y = 4;
    stem.castShadow = true;

    sunflower.add(stem);

    // Leaves
    const leafMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x388e3c
        });

    const leafGeometry =
        new THREE.SphereGeometry(1, 16, 8);

    const leafConnectorGeometry =
        new THREE.CylinderGeometry(0.07, 0.09, 0.75, 8);

    const leftLeaf =
        new THREE.Mesh(leafGeometry, leafMaterial);

    leftLeaf.scale.set(1.15, 0.25, 0.6);
    leftLeaf.position.set(-0.8, 3.8, 0);
    leftLeaf.rotation.z = -0.35;

    leftLeaf.castShadow = true;

    const leftLeafConnector =
        new THREE.Mesh(leafConnectorGeometry, leafMaterial);

    leftLeafConnector.position.set(-0.42, 3.9, 0);
    leftLeafConnector.rotation.z = 1.2;
    leftLeafConnector.castShadow = true;

    const rightLeaf =
        new THREE.Mesh(leafGeometry, leafMaterial);

    rightLeaf.scale.set(1.15, 0.25, 0.6);
    rightLeaf.position.set(0.8, 5, 0);
    rightLeaf.rotation.z = 0.35;

    rightLeaf.castShadow = true;

    const rightLeafConnector =
        new THREE.Mesh(leafConnectorGeometry, leafMaterial);

    rightLeafConnector.position.set(0.42, 4.9, 0);
    rightLeafConnector.rotation.z = -1.2;
    rightLeafConnector.castShadow = true;

    sunflower.add(leftLeafConnector);
    sunflower.add(leftLeaf);
    sunflower.add(rightLeafConnector);
    sunflower.add(rightLeaf);

    // Flower head center
    const centerGeometry =
        new THREE.SphereGeometry(1.1, 24, 16);

    const centerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x5d3a1a
        });

    const center =
        new THREE.Mesh(centerGeometry, centerMaterial);

    center.position.y = 8.5;
    center.scale.set(1, 1, 0.35);
    center.castShadow = true;

    sunflower.add(center);

    // Petals
    const petalGeometry =
        new THREE.SphereGeometry(0.7, 16, 8);

    const petalMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffd54f
        });

    for (let i = 0; i < 12; i++) {
        const petal =
            new THREE.Mesh(petalGeometry, petalMaterial);

        const angle =
            (Math.PI * 2 * i) / 12;

        petal.position.set(
            Math.cos(angle) * 1.25,
            8.5 + Math.sin(angle) * 1.25,
            0
        );

        petal.scale.set(0.7, 0.28, 0.16);
        petal.rotation.z = angle;
        petal.castShadow = true;

        sunflower.add(petal);
    }

    sunflower.position.set(x, 4, z);
    sunflower.scale.set(1.3, 1.3, 1.3);
    sunflower.rotation.y = Math.PI / 4;

    return sunflower;
}

export function canGrowSunflower(tile, levelConfig) {
    const allowedTiles = levelConfig.allowedSunflowerTiles;

    if (!allowedTiles) return true;

    return allowedTiles.some(([x, z]) =>
        tile.position.x === x &&
        tile.position.z === z
    );
}
