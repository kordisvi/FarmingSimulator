import * as THREE from 'three';

    // ---------------- SIGN ----------------
    function createSign(x, z) {
        const sign = new THREE.Group();
        const posterTexture =
            new THREE.TextureLoader().load('./images/poster.png');

        const woodMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x7b4a22
            });

        const posterMaterial =
            new THREE.MeshStandardMaterial({
                map: posterTexture,
                roughness: 0.85
            });

        const post =
            new THREE.Mesh(
                new THREE.BoxGeometry(1, 24, 1),
                woodMaterial
            );

        post.position.y = 12;
        post.castShadow = true;

        const board =
            new THREE.Mesh(
                new THREE.BoxGeometry(22, 10, 1.5),
                woodMaterial
            );

        board.position.y = 22;
        board.castShadow = true;

        const posterGeometry =
            new THREE.PlaneGeometry(22, 10);

        const frontPoster =
            new THREE.Mesh(
                posterGeometry,
                posterMaterial
            );

        frontPoster.position.set(0, 22, 0.76);

        const backPoster =
            new THREE.Mesh(
                posterGeometry,
                posterMaterial
            );

        backPoster.position.set(0, 22, -0.76);
        backPoster.rotation.y = Math.PI;

        sign.add(post);
        sign.add(board);
        sign.add(frontPoster);
        sign.add(backPoster);

        sign.position.set(x, -15, z);
        sign.scale.set(1, 3, 1);
        sign.rotation.y = Math.PI / 4;

        return sign;
    }

    export const sign = createSign(115, 100);
