import { createFileRoute } from "@tanstack/react-router";
import Messages from "@/pages/Messages";
export const Route = createFileRoute("/admin_/chat")({
  component: () => <Messages embedded />,
  validateSearch: (s: Record<string, unknown>) => ({ to: typeof s.to === "string" ? s.to : undefined }),
});
