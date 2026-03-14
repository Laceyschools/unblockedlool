export function encodeUrl(url: string): string {
  return btoa(url);
}

export function decodeUrl(encodedUrl: string): string {
  return atob(encodedUrl);
}
