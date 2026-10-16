export function formatDate(input?: string | number | Date | null): string {
  if (!input) return 'Never';

  try {
    const date = new Date(input);
    if (isNaN(date.getTime())) return 'Invalid date';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return 'Invalid date';
  }
}

export function formatRelativeTime(input?: string | number | Date | null): string {
  if (!input) return 'Never';

  try {
    const date = new Date(input);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return 'Just now';

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;

    return formatDate(input);
  } catch {
    return 'Recently';
  }
}
