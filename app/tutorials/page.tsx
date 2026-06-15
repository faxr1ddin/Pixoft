"use client";

import { useMemo, useState } from "react";
import TutorialCard from "@/components/TutorialCard";
import { tutorials } from "@/data/tutorials";

const ALL_TOPICS = ["All", "Animations", "UI Components", "Full Apps"];
const ALL_VERSIONS = ["All", "iOS 17+", "iOS 16+", "iOS 15+"];

export default function TutorialsPage() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [version, setVersion] = useState("All");

  const filtered = useMemo(() => {
    return tutorials.filter((tutorial) => {
      const matchesSearch = tutorial.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesTopic =
        topic === "All" || tutorial.tags.includes(topic);
      const matchesVersion =
        version === "All" || tutorial.iosVersion === version;
      return matchesSearch && matchesTopic && matchesVersion;
    });
  }, [search, topic, version]);

  return (
    <main className="mx-auto max-w-6xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">All Tutorials</h1>
      <p className="mt-2 text-white/60">
        Search and filter through every SwiftUI tutorial.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search tutorials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-blue-500 sm:max-w-xs"
        />

        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white outline-none focus:border-blue-500"
        >
          {ALL_TOPICS.map((t) => (
            <option key={t} value={t} className="bg-black">
              {t}
            </option>
          ))}
        </select>

        <select
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white outline-none focus:border-blue-500"
        >
          {ALL_VERSIONS.map((v) => (
            <option key={v} value={v} className="bg-black">
              {v}
            </option>
          ))}
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-white/50">
          No tutorials match your search.
        </p>
      )}
    </main>
  );
}
