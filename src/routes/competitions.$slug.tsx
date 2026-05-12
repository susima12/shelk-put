import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/CompetitionDetail";

export const Route = createFileRoute("/competitions/$slug")({
  component: Page,
});
