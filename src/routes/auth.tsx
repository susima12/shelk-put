import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Auth";

export const Route = createFileRoute("/auth")({
  component: Page,
});
