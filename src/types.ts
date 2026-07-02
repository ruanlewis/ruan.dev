export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  alt: string;
  description: string;
  details: string[];
  link?: string;
  isLocalOnly?: boolean;
}

export interface WorkflowStep {
  number: string;
  title: string;
  description: string;
}
