import * as THREE from 'three';

const shorelinePoints = [
    [-58, -8],
    [-45, -28],
    [-20, -38],
    [8, -32],
    [34, -42],
    [60, -22],
    [70, 4],
    [52, 26],
    [22, 38],
    [-6, 34],
    [-34, 44],
    [-62, 24]
];

function createLakeShape(scale = 1) {
    const shape = new THREE.Shape();

    const points =
        shorelinePoints.map(([x, z]) =>
            new THREE.Vector2(x * scale, -z * scale)
        );

    shape.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length; i++) {
        const current = points[i];
        const next = points[(i + 1) % points.length];
        const middleX = (current.x + next.x) / 2;
        const middleY = (current.y + next.y) / 2;

        shape.quadraticCurveTo(
            current.x,
            current.y,
            middleX,
            middleY
        );
    }

    shape.closePath();

    return shape;
}

function createRock(x, z, scale, color = 0x77736a) {
    const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1, 0),
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.9,
            metalness: 0
        })
    );

    rock.position.set(x, 1.1 * scale, z);
    rock.scale.set(
        3.5 * scale,
        1.35 * scale,
        2.3 * scale
    );
    rock.rotation.set(0.15, x * 0.04, z * 0.03);
    rock.castShadow = true;
    rock.receiveShadow = true;

    return rock;
}

function createReedCluster(x, z, rotation = 0, count = 5) {
    const reeds = new THREE.Group();

    const stemMaterial =
        new THREE.MeshStandardMaterial({ color: 0x3f7f2f });

    const tipMaterial =
        new THREE.MeshStandardMaterial({ color: 0x8a5a2b });

    for (let i = 0; i < count; i++) {
        const reed = new THREE.Group();
        const height = 5.5 + (i % 4) * 0.9;

        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.25, height, 6),
            stemMaterial
        );

        stem.position.y = height / 2;
        stem.rotation.z = -0.16 + i * 0.07;
        stem.castShadow = true;

        const tip = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.25, 1.6, 8),
            tipMaterial
        );

        tip.position.y = height + 0.55;
        tip.rotation.z = stem.rotation.z;
        tip.castShadow = true;

        reed.position.set(
            (i - (count - 1) / 2) * 0.95,
            0,
            Math.sin(i * 1.7) * 0.9
        );
        reed.add(stem, tip);
        reeds.add(reed);
    }

    reeds.position.set(x, 0, z);
    reeds.rotation.y = rotation;

    return reeds;
}

function createLilyPad(x, z, scale, rotation) {
    const pad = new THREE.Mesh(
        new THREE.CircleGeometry(2.4, 18, 0.35, Math.PI * 1.75),
        new THREE.MeshStandardMaterial({
            color: 0x2f7d32,
            roughness: 0.8
        })
    );

    pad.rotation.x = -Math.PI / 2;
    pad.rotation.z = rotation;
    pad.position.set(x, 0.34, z);
    pad.scale.set(scale, scale * 0.75, scale);

    return pad;
}

export function createLake(x = 0, z = 0) {
    const lake = new THREE.Group();

    const shoreMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x8d7754,
            roughness: 1
        });

    const waterMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2f9bd3,
            transparent: true,
            opacity: 0.78,
            roughness: 0.18,
            metalness: 0.05
        });

    const shore = new THREE.Mesh(
        new THREE.ShapeGeometry(createLakeShape(1.14)),
        shoreMaterial
    );

    shore.rotation.x = -Math.PI / 2;
    shore.position.y = 0.12;
    shore.receiveShadow = true;
    lake.add(shore);

    const water = new THREE.Mesh(
        new THREE.ShapeGeometry(createLakeShape()),
        waterMaterial
    );

    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.22;
    water.receiveShadow = true;
    lake.add(water);

    const rocks = [
        [-64, 18, 1.1, 0x78746d],
        [-42, -34, 0.75, 0x686860],
        [-30, -41, 0.45, 0x8a867a],
        [16, -43, 1.25, 0x77736a],
        [32, -39, 0.55, 0x69665f],
        [60, -14, 0.9, 0x817b70],
        [50, 31, 1.0, 0x706d67],
        [-18, 45, 0.7, 0x8a867d]
    ];

    rocks.forEach(([rockX, rockZ, scale, color]) => {
        lake.add(createRock(rockX, rockZ, scale, color));
    });

    const reedClusters = [
        [-55, -10, 0.4, 6],
        [-43, 32, -0.5, 4],
        [5, 39, 0.2, 7],
        [46, 20, -0.9, 5],
        [39, -32, 0.7, 4]
    ];

    reedClusters.forEach(([reedX, reedZ, rotation, count]) => {
        lake.add(createReedCluster(reedX, reedZ, rotation, count));
    });

    const lilyPads = [
        [-18, 8, 1.0, 0.8],
        [8, -12, 0.75, -0.5],
        [24, 12, 0.6, 1.4]
    ];

    lilyPads.forEach(([padX, padZ, scale, rotation]) => {
        lake.add(createLilyPad(padX, padZ, scale, rotation));
    });

    lake.position.set(x, 0, z);
    lake.scale.set(1.8, 1.8, 1.8);

    return lake;
}
