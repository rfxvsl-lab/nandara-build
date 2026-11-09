/**
 * Foto situs dalam format WebP (800 px & 1600 px) untuk srcset responsif.
 * TODO: ganti dengan foto proyek asli Nandara (design.md §6).
 */
import detailMaterial800 from "@/assets/detail-material-800.webp";
import detailMaterial from "@/assets/detail-material.webp";
import heroVilla800 from "@/assets/hero-villa-800.webp";
import heroVilla from "@/assets/hero-villa.webp";
import interiorSpace800 from "@/assets/interior-space-800.webp";
import interiorSpace from "@/assets/interior-space.webp";
import processSite800 from "@/assets/process-site-800.webp";
import processSite from "@/assets/process-site.webp";

export type ResponsiveImage = { src: string; srcSet: string; width: number; height: number };

function img(small: string, large: string, width: number, height: number): ResponsiveImage {
  const smallW = Math.round(width / 2);
  return { src: small, srcSet: `${small} ${smallW}w, ${large} ${width}w`, width, height };
}

export const IMAGES = {
  heroVilla: img(heroVilla800, heroVilla, 1600, 1000),
  detailMaterial: img(detailMaterial800, detailMaterial, 1276, 1600),
  interiorSpace: img(interiorSpace800, interiorSpace, 1600, 1145),
  processSite: img(processSite800, processSite, 1600, 1145),
} as const;
