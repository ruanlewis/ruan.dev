import { Project, WorkflowStep } from "./types";
import nyEditImg from "./assets/images/new_york_edit_screenshot_1782938321194.jpg";
import studioAxonImg from "./assets/images/studio_axon_screenshot_1782938345687.jpg";
import novaSystemsImg from "./assets/images/nova_systems_screenshot_1782938360537.jpg";
import muralisArtImg from "./assets/images/muralis_art_screenshot_1782938374136.jpg";

export const PROJECTS: Project[] = [
  {
    id: "new-york-edit",
    title: "The New York Edit",
    category: "Creative Direction • Web Design",
    year: "2024",
    image: nyEditImg,
    alt: "High-end website UI mockup for 'The New York Edit' luxury fashion editorial monograph, featuring clean typography and elegant grids.",
    description: "We built a serif-first digital publication for a contemporary fashion house, prioritizing high-fidelity typography and smooth vertical transitions.",
    details: [
      "Designed a typographic scale built entirely around custom serif weight layouts",
      "Optimized 12-column layout spacing for maximum readability and visual rhythm",
      "Seamless canvas slide transitions between editorial fashion sets",
      "Responsive luxury viewport styling engineered to maintain exact proportion ratios"
    ],
    link: "https://newyorkedit.ruan.dev"
  },
  {
    id: "studio-axon",
    title: "Studio Axon",
    category: "UI Architecture • E-commerce",
    year: "2023",
    image: studioAxonImg,
    alt: "Stark, brutalist concrete structure against a clear cerulean sky on the Studio Axon architectural platform.",
    description: "We designed a stark brutalist portfolio for an architectural studio, integrating fluid photo galleries with a high-speed commerce checkout.",
    details: [
      "Rigid Swiss typography structure aligned to a mathematical base metric grid",
      "Silent design language that highlights brutalist architecture photography",
      "Ultra-minimal, lightning-fast dynamic product interaction & purchase overlays",
      "Accessible dark/light dual polarity optimized for high-end device screens"
    ],
    link: "https://studioaxon.ruan.dev"
  },
  {
    id: "nova-systems",
    title: "Nova Systems",
    category: "Product Strategy • UX Design",
    year: "2024",
    image: novaSystemsImg,
    alt: "Sleek hardware device on a clean podium representing the Nova Systems premium tech landing page.",
    description: "We engineered the interactive marketing platform for high-end tactical hardware, utilizing performant web animation and responsive specifications.",
    details: [
      "Clean 3D-emulating canvas container for interacting with product models",
      "Minimal, intentional UI callouts styled in strict Royal Blue active states",
      "Mathematical layout spacing designed to balance complex industrial hardware specs",
      "Performance-tuned smooth loading animations that reflect precise build-craft"
    ],
    link: "https://novasystems.ruan.dev"
  },
  {
    id: "muralis-art",
    title: "Muralis Art",
    category: "Platform Design • Brand Identity",
    year: "2023",
    image: muralisArtImg,
    alt: "Abstract monochromatic paintings on the ultra-minimal Muralis Art contemporary gallery platform.",
    description: "We crafted an ultra-minimal exhibition archive for a contemporary art gallery, featuring asymmetrical layouts that foreground the fine art.",
    details: [
      "Pure white container grids designed with absolute structural minimalism",
      "Asymmetrical balancing of vertical typography coordinates",
      "Seamless high-fidelity transition states when reviewing individual monographs",
      "Custom typographic style prioritizing Swiss architecture principles"
    ],
    link: "https://muralisart.ruan.dev"
  }
];

export const WORKFLOW: WorkflowStep[] = [
  {
    number: "01",
    title: "Strategy",
    description: "Defining the core objective and aligning the visual hierarchy with business goals."
  },
  {
    number: "02",
    title: "Design",
    description: "Crafting a rigid, high-contrast visual system using the principles of typography and space."
  },
  {
    number: "03",
    title: "Development",
    description: "Clean, performance-optimized code that brings the precision of the design to life across devices."
  },
  {
    number: "04",
    title: "Launch",
    description: "Continuous refinement and strategic deployment to ensure a memorable impact."
  }
];
