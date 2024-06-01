export type WorkTile = {
  title: string;
  description: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
};

export const workTiles: WorkTile[] = [
  {
    description: `Here are asdathings`,
    title: `I've worked on`,
    image: {
      src: "/next.svg",
      width: 600,
      height: 770,
    },
  },
  {
    description: "I built",
    title: "Aphex Field",
    image: {
      src: "/next.svg",
      width: 600,
      height: 554,
    },
  },
  {
    description: `I maintained`,
    title: "Aphex Planner",
    image: {
      src: "/next.svg",
      width: 600,
      height: 717,
    },
  },
  {
    description: `I built`,
    title: "Aphex Publication",
    image: {
      src: "./next.svg",
      width: 600,
      height: 717,
    },
  },
];
