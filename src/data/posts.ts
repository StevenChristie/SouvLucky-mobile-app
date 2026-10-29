/** A news or event post. Posts are written in Supabase (Table Editor → posts). */
export type Post = {
  id: string;
  title: string;
  /** One or two sentences shown on the card. */
  summary: string;
  /** Full text; blank lines separate paragraphs. */
  body: string;
  /** An image URL, or a bundled default when the post has none. */
  image: number | string;
  /** Branch the post is about, if any (matches `Branch.id`). */
  branchId?: string;
  /** For events: when it happens, as an ISO date (YYYY-MM-DD). */
  eventDate?: string;
  /** ISO timestamp — newest posts are shown first. */
  publishedAt: string;
};

/** Used for posts published without an image. */
export const DEFAULT_POST_IMAGE: number = require("@assets/images/photos/meze-table.jpg");

/** Image source for expo-image from a post's `image` field. */
export const postImage = (image: Post["image"]) => (typeof image === "string" ? { uri: image } : image);

/** "Sat 31 Oct" */
export const formatEventDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" });
