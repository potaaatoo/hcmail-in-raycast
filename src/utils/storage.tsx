import { LocalStorage } from "@raycast/api";

export async function getStoredToken(): Promise<string | null> {
  const token = await LocalStorage.getItem<string>("hackclub_api_token");
  return token || null;
}

export async function setStoredToken(token: string): Promise<void> {
  await LocalStorage.setItem("hackclub_api_token", token);
}