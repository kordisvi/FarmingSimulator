import * as THREE from 'three';

export function createViolet(x, z) {
    const violet = new THREE.Group();

    const stemMaterial = new THREE.MeshStandardMaterial({
        color: 0x2f7d3b
    });

    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 3, 10),
        stemMaterial
    );

    stem.position.y = 1.5;
    stem.castShadow = true;

    const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x3f8f45
    });

    const leafGeometry = new THREE.SphereGeometry(0.6, 12, 8);
    const leafConnectorGeometry = new THREE.CylinderGeometry(0.04, 0.055, 0.42, 8);

    const leftLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leftLeaf.scale.set(1, 0.2, 0.55);
    leftLeaf.position.set(-0.42, 0.78, 0);
    leftLeaf.rotation.z = -0.35;
    leftLeaf.castShadow = true;

    const leftLeafConnector = new THREE.Mesh(leafConnectorGeometry, leafMaterial);
    leftLeafConnector.position.set(-0.2, 0.82, 0);
    leftLeafConnector.rotation.z = 1.15;
    leftLeafConnector.castShadow = true;

    const rightLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
    rightLeaf.scale.set(1, 0.2, 0.55);
    rightLeaf.position.set(0.42, 0.95, 0);
    rightLeaf.rotation.z = 0.35;
    rightLeaf.castShadow = true;

    const rightLeafConnector = new THREE.Mesh(leafConnectorGeometry, leafMaterial);
    rightLeafConnector.position.set(0.2, 0.93, 0);
    rightLeafConnector.rotation.z = -1.15;
    rightLeafConnector.castShadow = true;

    const petalMaterial = new THREE.MeshStandardMaterial({
        color: 0x7650b8
    });

    const petalGeometry = new THREE.SphereGeometry(0.45, 12, 8);

    for (let i = 0; i < 5; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        const angle = (Math.PI * 2 * i) / 5;

        petal.position.set(
            Math.cos(angle) * 0.5,
            3.1 + Math.sin(angle) * 0.25,
            Math.sin(angle) * 0.18
        );

        petal.scale.set(0.8, 0.25, 0.55);
        petal.rotation.z = angle;
        petal.castShadow = true;

        violet.add(petal);
    }

    const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 8),
        new THREE.MeshStandardMaterial({
            color: 0xffd95c
        })
    );

    center.position.y = 3.1;
    center.castShadow = true;

    violet.add(stem);
    violet.add(leftLeafConnector);
    violet.add(leftLeaf);
    violet.add(rightLeafConnector);
    violet.add(rightLeaf);
    violet.add(center);

    violet.position.set(x, 0, z);
    violet.scale.set(2, 2, 2);

    return violet;
}

export function canGrowViolet(tile, levelConfig) {
    const allowedTiles = levelConfig.allowedVioletTiles;

    if (!allowedTiles) return true;

    return allowedTiles.some(([x, z]) =>
        tile.position.x === x &&
        tile.position.z === z
    );
}
