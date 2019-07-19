import { Scene } from "@babylonjs/core/scene";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Octree } from "@babylonjs/core/Culling/Octrees/octree";
import { OctreeBlock } from "@babylonjs/core/Culling/Octrees/octreeBlock";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MultiMaterial } from "@babylonjs/core/Materials/multiMaterial";
import { Vector3, Axis, Color3 } from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import "@babylonjs/core/Meshes/meshBuilder";
import { SubMesh } from "@babylonjs/core/Meshes/subMesh";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { SolidParticleSystem } from "@babylonjs/core/Particles/solidParticleSystem";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
window.BABYLON = {
  Axis,
  Color3,
  Engine,
  FreeCamera,
  HemisphericLight,
  Mesh,
  MultiMaterial,
  Octree,
  OctreeBlock,
  Scene,
  SolidParticleSystem,
  StandardMaterial,
  SubMesh,
  Texture,
  Vector3,
  VertexData
};
const noaEngine = require("../../noa");

const noa = noaEngine({
  debug: true,
  texturePath: "assets/drummyfish/"
});

const images = ["default_grass", "default_grass_side", "farming_soil"];
for (const image of images) {
  noa.registry.registerMaterial(image, null, image + ".png");
}
noa.registry.registerBlock(1, {
  material: ["default_grass", "farming_soil", "default_grass_side"]
});

noa.world.on("worldDataNeeded", (id, data, x0, y0, z0) => {
  for (let dx = 0; dx < data.shape[0]; ++dx) {
    for (let dz = 0; dz < data.shape[2]; ++dz) {
      const x = x0 + dx;
      const z = z0 + dz;
      const height = (Math.sqrt(x * x + z * z) / 5) | 0;
      for (let dy = 0; dy < data.shape[1]; ++dy) {
        if (y0 + dy < height) {
          data.set(dx, dy, dz, 1);
        }
      }
    }
  }
  noa.world.setChunkData(id, data);
});

noa.inputs.down.on("fire", () => {
  if (noa.targetedBlock) {
    noa.setBlock(0, noa.targetedBlock.position);
  }
});
noa.inputs.down.on("alt-fire", () => {
  if (noa.targetedBlock) {
    noa.addBlock(grassID, noa.targetedBlock.adjacent);
  }
});
