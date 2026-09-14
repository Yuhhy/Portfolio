"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";

export default function Resume() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const controller = new AbortController();
    let task: PDFDocumentLoadingTask | undefined;
    let cancelled = false;

    const load = async () => {
      try {
        const [pdfjs, response] = await Promise.all([
          import("pdfjs-dist"),
          fetch("/huy-cv.pdf", { cache: "no-store", signal: controller.signal }),
        ]);
        if (cancelled) return;
        if (!response.ok) throw new Error("CV could not be loaded");
        // Serve the worker unchanged: Vite's development transforms inject
        // browser-only code that cannot run inside a dedicated worker.
        pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs/pdf.worker-${pdfjs.version}.min.mjs`;
        const data = await response.arrayBuffer();
        if (cancelled) return;
        task = pdfjs.getDocument({ data });
        const pdf = await task.promise;
        if (cancelled) return;
        container.replaceChildren();

        for (let number = 1; number <= pdf.numPages; number++) {
          if (cancelled) return;
          const page = await pdf.getPage(number);
          const naturalViewport = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: 2200 / naturalViewport.width });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          canvas.className = "resume-pdf-page";
          canvas.setAttribute("aria-hidden", "true");
          await page.render({ canvas, viewport }).promise;
          const content = await page.getTextContent();
          if (cancelled) return;
          const accessibleText = document.createElement("p");
          accessibleText.className = "sr-only";
          accessibleText.textContent = content.items.map((item) => "str" in item ? item.str : "").join(" ");
          const wrapper = document.createElement("div");
          wrapper.className = "resume-pdf-sheet";
          wrapper.append(canvas, accessibleText);
          container.append(wrapper);
          page.cleanup();
        }
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) {
          container.replaceChildren();
          setStatus("error");
        }
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        void load();
      }
    }, { rootMargin: "600px" });
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      controller.abort();
      void task?.destroy();
      container.replaceChildren();
    };
  }, []);

  return (
    <section id="resume" className="resume-section page-shell" aria-labelledby="resume-title">
      <div className="resume-heading">
        <h2 id="resume-title">Resume</h2>
        <a className="button button-outline" href="/huy-cv.pdf" download="Huy - English.pdf">Download CV (PDF) <span aria-hidden="true">↓</span></a>
      </div>
      {status === "loading" && <p role="status" className="resume-status">Loading CV…</p>}
      {status === "error" && <p role="alert" className="resume-status">Unable to display the CV. Please use Download CV (PDF) above.</p>}
      <div ref={containerRef} className="resume-document" aria-busy={status === "loading"} />
    </section>
  );
}
