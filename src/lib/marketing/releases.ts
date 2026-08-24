const GH_OWNER = 'geonmepark';
const GH_REPO = 'Why_Not_Darius';

export const GITHUB_REPO_URL = `https://github.com/${GH_OWNER}/${GH_REPO}`;
export const RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
const RELEASES_API = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/releases/latest`;

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
}

export interface ReleaseInfo {
  version: string;
  publishedAt: string;
  notesUrl: string;
  mac: ReleaseAsset | null;
  windows: ReleaseAsset | null;
}

interface GhRelease {
  tag_name: string;
  published_at: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
  }>;
}

const isMacAsset = (name: string) => /\.(dmg|pkg)$/i.test(name);
const isWinAsset = (name: string) => /\.(exe|msi)$/i.test(name);

/**
 * 최신 GitHub Release 메타데이터 조회. 릴리즈가 없거나 API 실패시 null 반환.
 * Server Component에서 호출되며 1시간 ISR 캐시.
 */
export async function getLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const res = await fetch(RELEASES_API, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as GhRelease;
    if (data.draft) return null;

    const macAsset = data.assets.find((a) => isMacAsset(a.name)) ?? null;
    const winAsset = data.assets.find((a) => isWinAsset(a.name)) ?? null;

    return {
      version: data.tag_name.replace(/^v/, ''),
      publishedAt: data.published_at,
      notesUrl: data.html_url,
      mac: macAsset
        ? { name: macAsset.name, url: macAsset.browser_download_url, size: macAsset.size }
        : null,
      windows: winAsset
        ? { name: winAsset.name, url: winAsset.browser_download_url, size: winAsset.size }
        : null,
    };
  } catch {
    return null;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)}KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)}MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)}GB`;
}

export function formatPublishedDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
