import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/MyApplications";
export const Route = createFileRoute("/my-applications")({ component: Page });
