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
    thumbnail: "/thumbnails/onboarding.png",
    downloadUrl: "https://github.com/pixoft/releases/releases/download/v1.0/onboarding.zip",
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
  {
    id: "glassmorphism-card",
    title: "Glassmorphism Profile Card",
    description:
      "Create a frosted-glass profile card with blur effects, soft shadows and a layered SwiftUI design.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/thumbnails/onboarding.png",
    downloadUrl: "https://github.com/pixoft/releases/releases/download/v1.0/glassmorphism-card.zip",
    tags: ["SwiftUI", "UI Components", "Glassmorphism"],
    iosVersion: "iOS 17+",
    xcodeVersion: "Xcode 15+",
    duration: "10 min",
    publishedAt: "2024-07-02",
    whatYoullLearn: [
      "Blur and material effects",
      "Layered card layouts",
      "Custom shadows and depth",
      "Reusable view components",
    ],
    fileStructure: `PixoftGlassCard/
├── App/
├── Domain/Model/
├── Core/Extensions/
└── Presentation/ProfileCard/`,
  },
  {
    id: "habit-tracker-app",
    title: "Habit Tracker App",
    description:
      "Build a full habit-tracking app with SwiftUI, Core Data persistence, charts and daily streaks.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "/thumbnails/onboarding.png",
    downloadUrl: "https://github.com/pixoft/releases/releases/download/v1.0/habit-tracker.zip",
    tags: ["SwiftUI", "Full Apps", "Core Data"],
    iosVersion: "iOS 16+",
    xcodeVersion: "Xcode 15+",
    duration: "32 min",
    publishedAt: "2024-07-20",
    whatYoullLearn: [
      "Core Data persistence",
      "Swift Charts for progress tracking",
      "Local notifications",
      "MVVM architecture",
    ],
    fileStructure: `PixoftHabitTracker/
├── App/
├── Domain/Model/
├── Data/CoreData/
├── Core/Extensions/
└── Presentation/
    ├── Habits/
    └── Stats/`,
  },
];

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.find((t) => t.id === slug);
}
