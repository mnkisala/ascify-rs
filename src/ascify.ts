import { tauri } from "@tauri-apps/api";

interface RenderArgs {
  data: string;
  columns: number;
  inverse: boolean;
  ramp?: string;
}

async function render({
  data,
  columns,
  inverse,
  ramp,
}: RenderArgs): Promise<string> {
  return await tauri.invoke("ascify", { data, columns, inverse, ramp });
}

async function rasterize(data: string, light: boolean): Promise<string> {
  return await tauri.invoke("rasterize", { data, light });
}

export type { RenderArgs };
export { render, rasterize };
