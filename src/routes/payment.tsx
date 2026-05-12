import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Payment";

export const Route = createFileRoute("/payment")({
  component: Page,
});
