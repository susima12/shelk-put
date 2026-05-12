import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/MasterClasses";

export const Route = createFileRoute("/master-classes")({
  component: Page,
});
