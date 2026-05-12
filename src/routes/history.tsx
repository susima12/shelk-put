import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/History";

export const Route = createFileRoute("/history")({
  component: Page,
});
