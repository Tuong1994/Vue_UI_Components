import type { ComputedRef, Ref } from "vue";
import type { ISourceOptions } from "@tsparticles/engine";
import type { ParticlesOptionParams } from "../../type";

const collideOptions = (params?: Ref<ParticlesOptionParams> | ComputedRef<ParticlesOptionParams>): ISourceOptions => {
  return {
    fullScreen: params?.value.fullScreen ?? true,
    background: { color: { value: params?.value.backgroundColor ?? "#222" } },
    particles: {
      number: { value: 50 },
      color: { value: params?.value.color ?? "#fff" },
      shape: { type: "circle" },
      size: { value: { min: 5, max: 15 } },
      move: { enable: true, speed: 3 },
      collisions: { enable: true },
    },
    detectRetina: true,
  };
};

export default collideOptions;
