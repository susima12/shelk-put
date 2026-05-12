import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Partners";

export const Route = createFileRoute("/partners")({
  component: Page,
});
