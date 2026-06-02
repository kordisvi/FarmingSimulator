import * as THREE from 'three';
  
  // ---------------- TREES ----------------
function createTree(x = 0, z = 0, y=0 , shape = null) {

    const tree = new THREE.Group();

    // ---------------- TRUNK ----------------
    const trunkGeometry =
        new THREE.CylinderGeometry(
            2,
            2,
            20,
            8
        );

    const trunkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x8B4513
        });

    const trunk =
        new THREE.Mesh(
            trunkGeometry,
            trunkMaterial
        );

    trunk.castShadow = true;

    trunk.position.y = 10;

    tree.add(trunk);

    // ---------------- LEAVES ----------------
    const leavesMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x228B22
        });

    // shape = 1 → fluffy tree leaves
    if (shape === 1) {

        const sphereGeometry =
            new THREE.SphereGeometry(
                10,
                16,
                16
            );

        // center leaves
        const centerLeaves =
            new THREE.Mesh(
                sphereGeometry,
                leavesMaterial
            );

        centerLeaves.position.set(0, 28, 0);

        centerLeaves.castShadow = true;

        tree.add(centerLeaves);

        // left leaves
        const leftLeaves =
            new THREE.Mesh(
                sphereGeometry,
                leavesMaterial
            );

        leftLeaves.position.set(-5, 24, 0);

        leftLeaves.castShadow = true;

        tree.add(leftLeaves);

        // right leaves
        const rightLeaves =
            new THREE.Mesh(
                sphereGeometry,
                leavesMaterial
            );

        rightLeaves.position.set(5, 24, 0);

        rightLeaves.castShadow = true;

        tree.add(rightLeaves);

        // front leaves
        const frontLeaves =
            new THREE.Mesh(
                sphereGeometry,
                leavesMaterial
            );

        frontLeaves.position.set(0, 24, 5);

        frontLeaves.castShadow = true;

        tree.add(frontLeaves);

        // back leaves
        const backLeaves =
            new THREE.Mesh(
                sphereGeometry,
                leavesMaterial
            );

        backLeaves.position.set(0, 24, -5);

        backLeaves.castShadow = true;

        tree.add(backLeaves);
    }

    // default / shape = 0 → cone leaves
    else {

        const leavesGeometry =
            new THREE.ConeGeometry(
                10,
                30,
                8
            );

        const leaves =
            new THREE.Mesh(
                leavesGeometry,
                leavesMaterial
            );

        leaves.castShadow = true;

        leaves.position.y = 30;

        tree.add(leaves);
    }

    tree.position.set(x, y, z);

    return tree;
}
 
export const tree0 = createTree(-60, 70);
export const tree1 = createTree(-350, 485, -50, 1);
export const tree2 = createTree(250, 280, -10, 1);
export const tree3 = createTree(-480, 480);
export const tree4 = createTree(-150, 330);
export const tree5 = createTree(100, 240, -6, 1);
export const tree6 = createTree(115, 0, -5);
export const tree7 = createTree(10, 25);
export const tree8 = createTree(-470, -300, -8, 1);
export const tree9 = createTree(-135, -120, -10);
export const tree10 = createTree(95, -155, -7, 1);
export const tree11 = createTree(360, -285, -12);
export const tree12 = createTree(-315, -405, -11);
export const tree13 = createTree(-55, -365, -9, 1);
export const tree14 = createTree(175, -420, -12);
export const tree15 = createTree(470, -165, -8, 1);

tree1.scale.set(5, 5, 3.5);
tree2.scale.set(2.5, 2, 2.5);
tree3.scale.set(4, 2, 4);
tree4.scale.set(4.2, 2, 4.2);
tree5.scale.set(2, 3 , 2);
tree8.scale.set(1.25, 1.6, 1.25);
tree9.scale.set(1.45, 1.35, 1.45);
tree10.scale.set(1.3, 1.5, 1.3);
tree11.scale.set(1.55, 1.35, 1.55);
tree12.scale.set(1.15, 1.25, 1.15);
tree13.scale.set(1.85, 2.15, 1.85);
tree14.scale.set(1.25, 1.2, 1.25);
tree15.scale.set(1.5, 1.45, 1.5);



