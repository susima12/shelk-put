import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Competitions";

export const Route = createFileRoute("/competitions")({
  component: Page,
});
