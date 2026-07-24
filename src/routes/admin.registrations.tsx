import { createFileRoute } from "@tanstack/react-router";

import { AdminRegistrationsPage } from "@/features/admin-registrations/AdminRegistrationsPage";

export const Route = createFileRoute("/admin/registrations")({
  head: () => ({
    meta: [
      { title: "Program Registrations | ZEN AI Admin" },
      {
        name: "description",
        content: "Protected ZEN AI program registration operations console.",
      },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: AdminRegistrationsPage,
});
