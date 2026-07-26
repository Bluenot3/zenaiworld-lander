import { createFileRoute } from "@tanstack/react-router";

import { ContentStudioPage } from "@/features/site-content/ContentStudioPage";

export const Route = createFileRoute("/admin/content")({
  head: () => ({
    meta: [
      { title: "ZEN Site Studio | ZEN AI Admin" },
      {
        name: "description",
        content: "Protected ZEN AI World page publishing studio.",
      },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: ContentStudioPage,
});
