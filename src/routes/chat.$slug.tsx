import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Chat";
export const Route = createFileRoute("/chat/$slug")({ component: Page });
