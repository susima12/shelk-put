import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Jury";

export const Route = createFileRoute("/jury")({
  component: Page,
});
