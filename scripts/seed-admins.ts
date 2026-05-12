import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(url, key, { auth: { persistSession: false } });

const { data: comps, error: cErr } = await sb.from("competitions").select("id, slug, name");
if (cErr) { console.error(cErr); process.exit(1); }

const { data: existingUsers } = await sb.auth.admin.listUsers({ perPage: 1000 });

const out: any[] = [];
for (const c of comps!) {
  const email = `admin_${c.slug}@festival.local`;
  const password = `Admin${c.slug.charAt(0).toUpperCase() + c.slug.slice(1)}2026!`;

  let userId = existingUsers?.users?.find((u) => u.email === email)?.id;
  if (!userId) {
    const { data: created, error: e } = await sb.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { display_name: `Admin · ${c.name}` },
    });
    if (e) { out.push({ email, status: "fail", e: e.message }); continue; }
    userId = created.user!.id;
  } else {
    // reset password to known value
    await sb.auth.admin.updateUserById(userId, { password });
  }

  const { data: existing } = await sb
    .from("user_roles").select("id")
    .eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (existing) {
    await sb.from("user_roles").update({ competition_id: c.id }).eq("id", existing.id);
  } else {
    await sb.from("user_roles").insert({ user_id: userId, role: "admin", competition_id: c.id });
  }
  out.push({ comp: c.name, email, password });
}

console.log(JSON.stringify(out, null, 2));
