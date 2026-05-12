import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Apply";

export const Route = createFileRoute("/apply")({
  component: Page,
});
