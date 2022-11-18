import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect, json } from "@remix-run/cloudflare";
import { createServerClient } from "@supabase/auth-helpers-remix";

export const action: ActionFunction = async ({ request, context }) => {
  const response = new Response();
  const supabase = createServerClient(
    context.SUPABASE_URL as string,
    context.SUPABASE_ANON_KEY as string,
    { request, response }
  );
  const { error } = await supabase.auth.signOut();
  return json(
    { error },
    {
      headers: response.headers,
    }
  );
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
