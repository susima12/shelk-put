import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_PASSWORDS: Record<string, string> = {
  vokal: "Vok2026",
  horeograph: "Hor2026",
  instrument: "Ins2026",
  teatr: "Tea2026",
  izo: "Izo2026",
  design: "Des2026",
  photo: "Pho2026",
  zhanr: "Zha2026",
  slovo: "Slo2026",
  pedagog: "Ped2026",
};

async function seed() {
  const { data: comps, error } = await supabaseAdmin
    .from("competitions")
    .select("id, slug, name");
  if (error) throw error;

  const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
  const out: any[] = [];

  for (const c of comps ?? []) {
    const password = ADMIN_PASSWORDS[c.slug as string];
    if (!password) continue;
    const email = `admin_${c.slug}@festival.local`;
    let userId = list?.users?.find((u) => u.email === email)?.id;

    if (!userId) {
      const { data: created, error: e } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: `Admin · ${c.name}` },
      });
      if (e) {
        out.push({ email, status: "fail", error: e.message });
        continue;
      }
      userId = created.user!.id;
    } else {
      await supabaseAdmin.auth.admin.updateUserById(userId, { password, email_confirm: true });
    }

    const { data: existing } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from("user_roles")
        .update({ competition_id: c.id })
        .eq("id", (existing as any).id);
    } else {
      await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin", competition_id: c.id });
    }
    out.push({ comp: c.name, email, password });
  }
  return out;
}

export const Route = createFileRoute("/api/public/setup-admins")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const result = await seed();
          return new Response(JSON.stringify({ ok: true, result }, null, 2), {
            headers: { "content-type": "application/json" },
          });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e?.message ?? String(e) }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
      POST: async () => {
        try {
          const result = await seed();
          return new Response(JSON.stringify({ ok: true, result }, null, 2), {
            headers: { "content-type": "application/json" },
          });
        } catch (e: any) {
          return new Response(JSON.stringify({ ok: false, error: e?.message ?? String(e) }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
