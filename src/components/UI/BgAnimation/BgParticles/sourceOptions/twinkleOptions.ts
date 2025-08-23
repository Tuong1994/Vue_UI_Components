import type { ComputedRef, Ref } from "vue";
import type { ISourceOptions } from "@tsparticles/engine";
import type { ParticlesOptionParams } from "../../type";

const twinkleOptions = (params?: Ref<ParticlesOptionParams> | ComputedRef<ParticlesOptionParams>): ISourceOptions => {
  return {
    fullScreen: params?.value.fullScreen ?? true,
    background: { color: { value: params?.value.backgroundColor ?? "#222" } },
    particles: {
      number: { value: 120 },
      color: { value: params?.value.color ?? "#fff" },
      shape: { type: "star" },
      size: { value: { min: 1, max: 4 } },
      move: { enable: true, speed: 0.5 },
      twinkle: { particles: { enable: true, color: "#ffff66", frequency: 0.05 } },
    },
    detectRetina: true,
  };
};

export default twinkleOptions;
