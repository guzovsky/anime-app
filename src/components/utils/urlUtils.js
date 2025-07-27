export function removeAutoPlay(url) {
    if (!url) return '';
    const cleanUrl = new URL(url);
    cleanUrl.searchParams.delete('autoplay');
    return cleanUrl.toString();
}