type AnimationDirection = "x" | "y" | "none";

interface MotionConfig {
  direction: AnimationDirection;
  reducedMotion: boolean;
}

interface Creator {
  id: number;
  name: string;
  color: string;
  image: string;
  imagePc: string;
  imageFolder: string;
  instagramUsername: string;
  instagramLink: string;
}

interface Project {
  id: number;
  name: string;
  image: string;
  type: "image" | "video";
  description: string;
  creatorId: number[];
}

interface ProjectsSectionProps {
  creator: Creator;
  projects: Project[];
}

interface SectionHeaderProps {
  sectionId: string;
  motionConfig: MotionConfig;
}

interface ServiceItem {
  title: string;
  description: string;
}

interface ServicesGridProps {
  services: ServiceItem[];
  motionConfig: MotionConfig;
}

interface AnalysisItem {
  id: number;
  image: string;
  type?: "image" | "video";
  creatorId: number[];
}

interface AnalysisState {
  data: Record<number, ImageAnalysis>;
  isLoading: boolean;
  analyzeAll: (items: AnalysisItem[]) => Promise<void>;
}

interface SectionState {
  currentSection: string;
  setSection: (section: string) => void;
}

interface ServiceCardProps {
  service: ServiceItem;
  motionConfig: MotionConfig;
}
