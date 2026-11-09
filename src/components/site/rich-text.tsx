import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Perender teks format sederhana → elemen React (TANPA innerHTML, aman dari XSS).
 *
 * Blok (dipisah baris kosong):  "## Judul", "### Subjudul", "- item", "1. item", "> kutipan", paragraf.
 * Inline: **tebal**, *miring*, [teks](https://… | /path-internal)
 */

const SAFE_URL = /^(https?:\/\/|\/(?!\/))/i;

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[2])
      out.push(
        <strong key={k} className="font-semibold text-arang">
          {m[2]}
        </strong>,
      );
    else if (m[4]) out.push(<em key={k}>{m[4]}</em>);
    else if (m[6] && m[7]) {
      const url = m[7];
      if (SAFE_URL.test(url)) {
        const external = url.startsWith("http");
        out.push(
          <a
            key={k}
            href={url}
            {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
            className="text-emas-ink underline underline-offset-4 hover:text-arang"
          >
            {m[6]}
          </a>,
        );
      } else out.push(m[6]);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function withBreaks(text: string, keyBase: string): ReactNode[] {
  return text
    .split("\n")
    .flatMap((line, i) => [
      ...(i > 0 ? [<br key={`${keyBase}-br${i}`} />] : []),
      <Fragment key={`${keyBase}-l${i}`}>{inline(line, `${keyBase}-${i}`)}</Fragment>,
    ]);
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n{2,}/);
  return (
    <div className={cn("space-y-5 text-[1.0625rem] leading-relaxed text-beton", className)}>
      {blocks.map((block, b) => {
        const key = `b${b}`;
        const lines = block.split("\n");
        if (block.startsWith("### ")) {
          return (
            <h3 key={key} className="pt-2 text-xl font-normal text-arang">
              {inline(block.slice(4), key)}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2
              key={key}
              className="pt-4 text-[1.625rem] font-normal leading-tight tracking-[-0.01em] text-arang"
            >
              {inline(block.slice(3), key)}
            </h2>
          );
        }
        if (lines.every((l) => /^[-*] /.test(l))) {
          return (
            <ul key={key} className="list-disc space-y-1.5 pl-6 marker:text-emas-ink">
              {lines.map((l, i) => (
                <li key={i}>{inline(l.slice(2), `${key}-${i}`)}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\. /.test(l))) {
          return (
            <ol key={key} className="list-decimal space-y-1.5 pl-6 marker:text-emas-ink">
              {lines.map((l, i) => (
                <li key={i}>{inline(l.replace(/^\d+\. /, ""), `${key}-${i}`)}</li>
              ))}
            </ol>
          );
        }
        if (lines.every((l) => l.startsWith("> "))) {
          return (
            <blockquote key={key} className="border-l-2 border-emas pl-5 italic text-arang">
              {withBreaks(lines.map((l) => l.slice(2)).join("\n"), key)}
            </blockquote>
          );
        }
        return <p key={key}>{withBreaks(block, key)}</p>;
      })}
    </div>
  );
}
