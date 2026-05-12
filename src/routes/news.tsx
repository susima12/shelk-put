import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/News";

export const Route = createFileRoute("/news")({
  component: Page,
});
