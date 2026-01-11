export interface Photo {
  id: string;
  src: string;
  aspectRatio?: "portrait" | "landscape" | "square";
  // For bento grid layout
  gridArea?: string;
  // For video support
  type?: "image" | "video";
}

export interface PhaseData {
  id: string;
  name: string;
  shortName: string;
  photos: Photo[];
  layout?: "strip" | "bento";
}

export interface PumSection {
  date: string | null;
  images: string[];
}

// Legacy alias for backwards compatibility
export type MonthData = PhaseData;

export const PHASES: PhaseData[] = [
  {
    id: "phase-1",
    name: "Sương Tan Xuân Sang",
    shortName: "Phase 1",
    layout: "bento",
    photos: [
      { id: "p1-1", src: "/Recap/phase 1/1.webp", gridArea: "a" },
      { id: "p1-2", src: "/Recap/phase 1/2.webp", gridArea: "b" },
      { id: "p1-3", src: "/Recap/phase 1/3.webp", gridArea: "c" },
      { id: "p1-4", src: "/Recap/phase 1/4.webp", gridArea: "d" },
      { id: "p1-5", src: "/Recap/phase 1/5.webp", gridArea: "e" },
      { id: "p1-6", src: "/Recap/phase 1/6.webp", gridArea: "f" },
      { id: "p1-7", src: "/Recap/phase 1/7.webp", gridArea: "g" },
      { id: "p1-8", src: "/Recap/phase 1/8.webp", gridArea: "h" },
      { id: "p1-9", src: "/Recap/phase 1/9.webp", gridArea: "i" },
      { id: "p1-10", src: "/Recap/phase 1/10.webp", gridArea: "j" },
    ],
  },
  {
    id: "phase-2",
    name: "Xuân Về Bên Nhau",
    shortName: "Phase 2",
    layout: "bento",
    photos: [
      { id: "p2-1", src: "/Recap/phase 2/1.webp", gridArea: "a" },
      { id: "p2-2", src: "/Recap/phase 2/2.webp", gridArea: "b" },
      { id: "p2-3", src: "/Recap/phase 2/3.webp", gridArea: "c" },
      { id: "p2-4", src: "/Recap/phase 2/4.webp", gridArea: "d" },
      { id: "p2-5", src: "/Recap/phase 2/5.webp", gridArea: "e" },
      { id: "p2-6", src: "/Recap/phase 2/6.webp", gridArea: "f" },
      { id: "p2-7", src: "/Recap/phase 2/7.webp", gridArea: "g" },
      { id: "p2-8", src: "/Recap/phase 2/8.webp", gridArea: "h" },
      { id: "p2-9", src: "/Recap/phase 2/9.webp", gridArea: "i" },
      { id: "p2-10", src: "/Recap/phase 2/10.webp", gridArea: "j" },
      { id: "p2-11", src: "/Recap/phase 2/11.webp", gridArea: "k" },
      { id: "p2-12", src: "/Recap/phase 2/12.webp", gridArea: "l" },
    ],
  },
  {
    id: "phase-3",
    name: "Ngày Mới Nhẹ Nhàng",
    shortName: "Phase 3",
    layout: "bento",
    photos: [
      { id: "p3-1", src: "/Recap/phase 3/1.webp", gridArea: "a" },
      { id: "p3-2", src: "/Recap/phase 3/2.webp", gridArea: "b" },
      { id: "p3-3", src: "/Recap/phase 3/3.webp", gridArea: "c" },
    ],
  },
];

// Legacy alias - kept for any components still using MONTHS
export const MONTHS = PHASES;

export const PUM_SECTIONS: PumSection[] = [
  {
    date: "Nov 2022",
    images: [
      "IMG_2203.webp",
      "IMG_2204.webp",
      "IMG_2205.webp",
      "IMG_2206.webp",
      "IMG_2207.webp",
      "IMG_2208.webp",
    ],
  },
  {
    date: "Dec 2022",
    images: ["IMG_2209.webp", "IMG_2210.webp"],
  },
  {
    date: "Jan 2023",
    images: ["IMG_2211.webp", "IMG_2212.webp"],
  },
  {
    date: "Feb 2023",
    images: ["IMG_2213.webp", "IMG_2214.webp"],
  },
  {
    date: "Mar 2023",
    images: [
      "IMG_2215.webp",
      "IMG_2216.webp",
      "IMG_2217.webp",
      "IMG_2218.webp",
      "IMG_2219.webp",
      "IMG_2220.webp",
      "IMG_2221.webp",
      "IMG_2222.webp",
    ],
  },
  {
    date: "Jun 2023",
    images: ["IMG_2223.webp"],
  },
  {
    date: "Dec 2023",
    images: [
      "IMG_2224.webp",
      "IMG_2225.webp",
      "IMG_2226.webp",
      "IMG_2238.webp",
    ],
  },
  {
    date: "Feb 2024",
    images: ["IMG_2227.webp", "IMG_2228.webp"],
  },
  {
    date: "Jun 2024",
    images: ["IMG_2229.webp", "IMG_2230.webp", "IMG_1828.webp"],
  },
  {
    date: "Oct 2024",
    images: [
      "IMG_2231.webp",
      "IMG_2232.webp",
      "IMG_2233.webp",
      "IMG_2234.webp",
      "IMG_1938.webp",
      "IMG_2236.webp",
      "IMG_1936.webp",
    ],
  },
  {
    date: "Dec 2025",
    images: [
      "IMG_1775.webp",
      "IMG_1778.webp",
      "IMG_1935.webp",
      "IMG_2068.webp",
      "IMG_2069 2.webp",
      "IMG_2070.webp",
      "IMG_2071 2.webp",
      "IMG_2240.webp",
    ],
  },
];
