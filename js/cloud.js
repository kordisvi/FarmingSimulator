import * as THREE from 'three';

// -----CLOUD CREATION-----
function createShadowCloud() {
    const cloud = new THREE.Group();

    const cloudMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xf4f1e8
        });

    const cloudParts = [
        [-7, 0, 0, 1.2],
        [0, 2, 0, 1.5],
        [7, 0, 0, 1.2],
        [-2, -1, 4, 1.1],
        [4, -1, -4, 1.1]
    ];

    cloudParts.forEach(([x, y, z, scale]) => {
        const puff =
            new THREE.Mesh(
                new THREE.SphereGeometry(9, 16, 10),
                cloudMaterial
            );

        puff.position.set(x, y, z);
        puff.scale.set(scale, scale * 0.7, scale);
        puff.castShadow = true;

        cloud.add(puff);
    });

    return cloud;
}

export const shadowCloud = createShadowCloud();

// -----CLOUD MOVEMENT-----

const shadowTargetPoint = new THREE.Vector3(90, 0.4, 0);

export function updateCloudShadow(sun) {
    const rayDirection =
        sun.position.clone().sub(shadowTargetPoint).normalize();

    if (rayDirection.y <= 0) {
        shadowCloud.visible = false;
        return;
    }

    shadowCloud.visible = true;

    const distanceToCloud =
        (90 - shadowTargetPoint.y) / rayDirection.y;

    const cloudPosition =
        shadowTargetPoint.clone().add(
            rayDirection.multiplyScalar(distanceToCloud)
        );

    shadowCloud.position.copy(cloudPosition);
}
