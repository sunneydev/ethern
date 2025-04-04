export async function signOut() {
  await fetch("/auth/account/sign-out", { method: "POST" });
}
