import { tauri } from "@tauri-apps/api";

async function render(
  data: string,
  columns: number,
  invert: boolean,
  ramp?: string
): Promise<string> {
  return await tauri.invoke("ascify", { data, columns, inverse: invert, ramp });
}

async function rasterize(data: string, light: boolean): Promise<string> {
  return await tauri.invoke("rasterize", { data, light });
}

export { render, rasterize };
