export type Tutorial = {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  downloadUrl: string;
  tags: string[];
  iosVersion: string;
  xcodeVersion: string;
  duration: string;
  publishedAt: string;
  whatYoullLearn: string[];
  fileStructure: string;
};

export const tutorials: Tutorial[] = [
  {
    id: "onboarding-screen",
    title: "Animated Onboarding Screen",
    description:
      "Build a beautiful animated onboarding screen with SwiftUI, featuring glassmorphism cards, gradient backgrounds and swipe gestures.",
    youtubeId: "HLY1HGLFI64",
    thumbnail: "https://img.youtube.com/vi/HLY1HGLFI64/maxresdefault.jpg",
    downloadUrl: "https://github.com/faxr1ddin/Pixoft/releases/download/v1.0-onboarding/PixoftOnboarding.zip",
    tags: ["SwiftUI", "Animation", "Onboarding"],
    iosVersion: "iOS 17+",
    xcodeVersion: "Xcode 15+",
    duration: "15 min",
    publishedAt: "2024-06-15",
    whatYoullLearn: [
      "Animated gradient backgrounds",
      "Glassmorphism icon cards",
      "Swipe gesture navigation",
      "Spring animations",
    ],
    fileStructure: `PixoftOnboarding/
├── App/
├── Domain/Model/
├── Core/Extensions/
└── Presentation/Onboarding/`,
  },
];

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.find((t) => t.id === slug);
}
