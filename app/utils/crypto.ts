export async function sha256(data: ArrayBuffer | string): Promise<string> {
  if (typeof data === 'string') {
    data = new TextEncoder().encode(data);
  }
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(x => x.toString(16).padStart(2, '0')).join('');
}
