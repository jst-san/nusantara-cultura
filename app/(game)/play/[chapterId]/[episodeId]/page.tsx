import type { Metadata } from "next";
import { StoryPlayer } from "@/components/story/StoryPlayer";
import { getChapter, getEpisode } from "@/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapterId: string; episodeId: string }>;
}): Promise<Metadata> {
  const { chapterId, episodeId } = await params;
  const chapter = getChapter(chapterId);
  const episode = getEpisode(chapterId, episodeId);
  if (!chapter || !episode) return { title: "Cerita" };
  return { title: `${episode.title} — ${chapter.title}` };
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ chapterId: string; episodeId: string }>;
}) {
  const { chapterId, episodeId } = await params;
  return <StoryPlayer chapterId={chapterId} episodeId={episodeId} />;
}
