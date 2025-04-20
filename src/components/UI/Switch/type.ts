import type { ComponentColor } from "@/common/type";

export type SwitchColor = Exclude<ComponentColor, "black" | "white" | "gray">