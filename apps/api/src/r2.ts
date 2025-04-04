export async function get(domain: string, path: string, cf?: CfProperties) {
  const response = await fetch(`${domain}/${path}`, {
    method: "GET",
    cf,
  }).catch((err) => console.error(`Failed to fetch /${path}: ${err}`));

  if (!response || (response.status !== 200 && response.status !== 404)) {
    console.error(`Failed to fetch /${path}: ${response?.status}`);
    return new Response(null, { status: 500 });
  }

  return response;
}

export * as r2 from "./r2";
