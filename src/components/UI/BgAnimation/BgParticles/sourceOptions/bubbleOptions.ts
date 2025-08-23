import type { ComputedRef, Ref } from "vue";
import type { ParticlesOptionParams } from "../../type";
import { MoveDirection, OutMode, type ISourceOptions } from "@tsparticles/engine";

const bubbleOptions = (params?: Ref<ParticlesOptionParams> | ComputedRef<ParticlesOptionParams>): ISourceOptions => {
  return {
    fullScreen: params?.value.fullScreen ?? true,
    background: {
      color: {
        value: params?.value.backgroundColor ?? "#fff",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "bubble", // Đổi từ "repulse" sang "bubble"
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        bubble: {
          distance: 200, // Khoảng cách phát hiện hover
          duration: 2, // Thời gian hiệu ứng tồn tại
          size: 10, // Kích thước particles sẽ nở ra
          opacity: 1, // Độ trong suốt khi bubble
        },
      },
    },
    particles: {
      color: {
        value: params?.value.color ?? '#222',
      },
      links: {
        enable: false, // Tắt hiệu ứng nối lines
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.out,
        },
        random: false,
        speed: 6,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: 150,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };
};

export default bubbleOptions;
