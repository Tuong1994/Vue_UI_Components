import type { ComputedRef, Ref } from "vue";
import type { ISourceOptions } from "@tsparticles/engine";
import type { ParticlesOptionParams } from "../../type";

const grabsOptions = (params?: Ref<ParticlesOptionParams> | ComputedRef<ParticlesOptionParams>): ISourceOptions => {
  return {
    fullScreen: params?.value.fullScreen ?? true,
    background: { color: { value: params?.value.backgroundColor ?? "#222" } },
    particles: {
      number: { value: 80 },
      color: { value: params?.value.color ?? "#fff" },
      links: { enable: false },
      move: { enable: true, speed: 1.5 },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
      },
      modes: {
        grab: { distance: 180, links: { opacity: 0.6 } },
      },
    },
    detectRetina: true,
  };
};

export default grabsOptions;
