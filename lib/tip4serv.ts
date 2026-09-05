import { config } from './config';

export async function tip4serv(endpoint: string, init: RequestInit = {}) {
  if (!config.api.key) throw new Error('TIP4SERV_API_KEY is not configured');
  return fetch(`${config.api.baseUrl}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.api.key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
}

export async function getJson<T>(endpoint: string): Promise<T> {
  const response = await tip4serv(endpoint);
  if (!response.ok) throw new Error(`Tip4Serv API error ${response.status}`);
  return response.json();
}