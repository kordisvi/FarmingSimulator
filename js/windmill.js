import * as THREE from "three";

export function createWindmill() {
  const windmill = new THREE.Group();

  // texture loader
  const textureLoader = new THREE.TextureLoader();

  // load stone texture
  const stoneTexture = textureLoader.load(
    "/textures/stone-wall.png" // <- change path if needed
  );

  // make texture tile nicely
  stoneTexture.wrapS = THREE.RepeatWrapping;
  stoneTexture.wrapT = THREE.RepeatWrapping;
  stoneTexture.repeat.set(2, 4);
  stoneTexture.colorSpace = THREE.SRGBColorSpace;

  // tower
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 3, 20, 32),
    new THREE.MeshStandardMaterial({
      map: stoneTexture,
      roughness: 1,
      metalness: 0
    })
  );

  tower.position.y = 10;
  tower.castShadow = true;
  tower.receiveShadow = true;
  windmill.add(tower);

  // cap
  const cap = new THREE.Mesh(
    new THREE.ConeGeometry(3.2, 4, 4),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
  );

  cap.position.y = 22;
  cap.rotation.y = Math.PI / 4;
  cap.castShadow = true;
  windmill.add(cap);

  // rotor pivot
  const rotor = new THREE.Group();
  rotor.position.set(0, 21, 3);

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 0.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x5a3a20 })
  );

  hub.rotation.x = Math.PI / 2;
  hub.castShadow = true;
  rotor.add(hub);

  const bladeGeo = new THREE.BoxGeometry(0.35, 7, 0.25);
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

  for (let i = 0; i < 4; i++) {
    const bladeRoot = new THREE.Group();
    const blade = new THREE.Mesh(bladeGeo, bladeMat);

    blade.position.y = 3.5;
    blade.castShadow = true;

    bladeRoot.rotation.z = (i * Math.PI) / 2;
    bladeRoot.add(blade);

    rotor.add(bladeRoot);
  }

  windmill.add(rotor);

  windmill.userData.rotor = rotor;

  return windmill;
}