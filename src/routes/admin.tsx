import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Admin";

export const Route = createFileRoute("/admin")({
  component: Page,
});
