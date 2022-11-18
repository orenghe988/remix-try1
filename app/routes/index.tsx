import { ActionFunction, LoaderFunction, json } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";

export const loader: LoaderFunction = async ({ request, context }) => {
  const response = new Response();
  const supabaseClient = createServerClient(
    context.SUPABASE_URL as string,
    context.SUPABASE_ANON_KEY as string,
    { request, response }
  );

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  return json(session);
};

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const loginEmail = formData.get("email");
  const loginPassword = formData.get("password");

  const response = new Response();
  const supabaseClient = createServerClient(
    context.SUPABASE_URL as string,
    context.SUPABASE_ANON_KEY as string,
    { request, response }
  );

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: String(loginEmail),
    password: String(loginPassword),
  });
  response.headers.set(
    "set-cookie",
    response.headers.get("set-cookie")! + "; HttpOnly"
  );
  console.log(response.headers);
  return json(
    { data, error },
    {
      headers: response.headers,
    }
  );
};

export default function Index() {
  const session = useLoaderData();
  return (
    <>
      <h1>Hello world!</h1>
      {!session ? (
        <Form method="post">
          <input type="email" name="email" placeholder="email" required />
          <input
            type="password"
            name="password"
            placeholder="password"
            required
          />
          <button type="submit">Log in</button>
        </Form>
      ) : (
        <>
          <h2>hello {session.user.email}</h2>
          <Form action="/logout" method="post">
            <button type="submit">Log out</button>
          </Form>
        </>
      )}
    </>
  );
}
