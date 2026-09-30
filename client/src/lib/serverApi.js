// Calls the Express API from server components (blog pages, sitemap).
// The browser uses lib/api.js instead.
const API_URL = process.env.API_URL || "http://localhost:5000";

// Pages are cached and refreshed at most once a minute, so a post published
// in the admin panel appears on the site within about a minute.
export const BLOG_REVALIDATE_SECONDS = 60;

// Returns the JSON, null for a 404, or undefined if the API couldn't be reached
// (so pages can show an empty state instead of crashing, e.g. during a build).
export async function fetchApi(path, { revalidate = BLOG_REVALIDATE_SECONDS } = {}) {
  try {
    const res = await fetch(`${API_URL}/api${path}`, { next: { revalidate } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`API request ${path} failed: ${err.message}`);
    return undefined;
  }
}
