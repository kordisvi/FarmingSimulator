import * as THREE from 'three';

const FENCE_SPACING = 20;

function createFencePiece(fenceParts, x, z, rotate = 0) {
    const fence = new THREE.Group();
    const isHorizontal = rotate === 1;

    const post1 = new THREE.Mesh(
        fenceParts.postGeometry,
        fenceParts.material
    );

    const post2 = new THREE.Mesh(
        fenceParts.postGeometry,
        fenceParts.material
    );

    const plank = new THREE.Mesh(
        fenceParts.plankGeometry,
        fenceParts.material
    );

    post1.castShadow = true;
    post2.castShadow = true;
    plank.castShadow = true;

    if (isHorizontal) {
        post1.position.set(x + 2, 5, z);
        post2.position.set(x + 18, 5, z);
        plank.position.set(x + 10, 8, z);
    }
    else {
        post1.position.set(x, 5, z + 2);
        post2.position.set(x, 5, z + 18);
        plank.position.set(x, 8, z + 10);
        plank.rotation.y = Math.PI / 2;
    }

    fence.add(post1, post2, plank);

    return fence;
}

function addFenceLine(levelFences, fenceParts, fenceConfig) {
    let x = fenceConfig.startX;
    let z = fenceConfig.startZ;

    for (let i = 0; i < fenceConfig.steps; i++) {
        levelFences.add(
            createFencePiece(
                fenceParts,
                x,
                z,
                fenceConfig.rotate
            )
        );

        if (fenceConfig.rotate === 1) {
            x += FENCE_SPACING;
        }
        else {
            z += FENCE_SPACING;
        }
    }
}

export function buildLevelFences(scene, levelConfig) {
    const fenceParts = createFenceParts();
    const levelFences = new THREE.Group();

    (levelConfig.fences || []).forEach((fenceConfig) => {
        addFenceLine(levelFences, fenceParts, fenceConfig);
    });

    scene.add(levelFences);

    return levelFences;
}

function createFenceParts() {
    return {
        postGeometry: new THREE.CylinderGeometry(
            0.7,
            0.7,
            10
        ),
        plankGeometry: new THREE.BoxGeometry(
            20,
            2.5,
            1,
            4
        ),
        material: new THREE.MeshStandardMaterial({
            color: 0x8b5a2b
        })
    };
}
