import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Contacts";

export const Route = createFileRoute("/contacts")({
  component: Page,
});
