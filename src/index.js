/*
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
*/
import Engine from 'noa-engine'


let log = () => undefined;
(function setupDebug() {
window.LOG = {};
window.LOG.lines = ['hello'];
window.LOG.vars = { x: Math.random() };
const anyAsString = o =>
  typeof o === "object" ? JSON.stringify(o) : String(o);

  const logElem = document.createElement("div");
  const varElem = document.createElement("div");
  const style = {
    position: "fixed",
    zIndex: 100,
    top: "0px",
    "text-shadow": "0px 0px 1px #fff",
    font: "12px sans-serif",
    "pointer-events": "none",
    "white-space": "nowrap",
    overflow: "hidden"
  };
  Object.assign(logElem.style, style);
  logElem.style.width = "70%";

  Object.assign(varElem.style, style);
  varElem.style.width = "20%";
  varElem.style.right = "0px";

  document.body.append(logElem);
  document.body.append(varElem);
  setInterval(() => {
    const htmlEscape = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const numberOfLines = 40;
    if (window.LOG.lines.length > numberOfLines) {
      window.LOG.lines = window.LOG.lines.slice(window.LOG.lines.length - numberOfLines);
    }
    logElem.innerHTML = window.LOG.lines.map(htmlEscape).join("<br>");
    const varLines = [];
    for (let k in window.LOG.vars) {
      if (window.LOG.vars[k] !== undefined) {
        varLines.push(k + ": " + anyAsString(window.LOG.vars[k]));
      }
      log(k, varLines);
    }
    varElem.innerHTML = varLines.map(htmlEscape).join("<br>");
  }, 300);

log = () => window.LOG.lines.push(
    Array.from(arguments)
      .map(anyAsString)
      .join(" ")
  );
window.LOG.log = log;
})();

const noa = new Engine({
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
