/**
 * Renders a product video from a plain URL. YouTube/Vimeo links (the
 * common case — staff pasting a share link) get a responsive iframe
 * embed; anything else is treated as a direct file URL and served with
 * a native <video> element. No self-hosted-vs-embed decision is forced
 * on the content author — both are auto-detected from the URL shape.
 */
function getEmbedUrl(src: string): string | null {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const id = url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).pop();
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}

export function ProductVideo({ src, caption }: { src: string; caption?: string }) {
  const embedUrl = getEmbedUrl(src);

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-video w-full bg-emc-navy-900">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={caption ?? "Product video"}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video controls className="size-full object-contain" src={src}>
            Your browser does not support embedded videos.
          </video>
        )}
      </div>
      {caption && (
        <figcaption className="px-4 py-3 text-sm text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
