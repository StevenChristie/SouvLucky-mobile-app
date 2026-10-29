import { useEffect, useState } from "react";

import { DEFAULT_POST_IMAGE, type Post } from "@/data/posts";
import { supabase } from "./supabase";

type PostRow = {
  id: string;
  title: string;
  summary: string;
  body: string;
  image_url: string | null;
  branch_id: string | null;
  event_date: string | null;
  published_at: string;
};

const toPost = (r: PostRow): Post => ({
  id: r.id,
  title: r.title,
  summary: r.summary,
  body: r.body,
  image: r.image_url || DEFAULT_POST_IMAGE,
  branchId: r.branch_id ?? undefined,
  eventDate: r.event_date ?? undefined,
  publishedAt: r.published_at,
});

// Shared between screens so opening a post doesn't refetch the whole feed.
let cache: Post[] | null = null;

async function fetchPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, summary, body, image_url, branch_id, event_date, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  cache = (data as PostRow[]).map(toPost);
  return cache;
}

/** News & events feed from Supabase (published posts, newest first). */
export function useNews() {
  const [posts, setPosts] = useState<Post[]>(cache ?? []);
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    let alive = true;
    fetchPosts()
      .then((p) => alive && setPosts(p))
      .catch((e) => console.warn("Could not load news", e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { posts, loading };
}

export function usePost(id: string | undefined) {
  const { posts, loading } = useNews();
  return { post: posts.find((p) => p.id === id), loading };
}
