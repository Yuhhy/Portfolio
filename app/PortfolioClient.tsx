"use client";

import Resume from "./Resume";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const HLS_SOURCE =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

const EASE = [0.25, 0.1, 0.25, 1] as const;

type Project = {
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  span: string;
  ratio: string;
};

type HlsInstance = import("hls.js").default;

type Exploration = {
  title: string;
  type: string;
  year: string;
  image: string;
  rotation: number;
};

const PROJECTS: Project[] = [
  {
    title: "Automotive Motion",
    category: "Interaction Design / Motion",
    year: "2026",
    description:
      "A cinematic configurator for the next generation of electric mobility.",
    image:
      "https://images.unsplash.com/photo-1642598728744-817374f1dc99?auto=format&fit=crop&w=1800&q=85",
    span: "md:col-span-7",
    ratio: "aspect-[16/11]",
  },
  {
    title: "Urban Architecture",
    category: "Digital Direction / Development",
    year: "2025",
    description:
      "A modular editorial platform shaped around people, place, and public life.",
    image:
      "https://images.unsplash.com/photo-1769622559799-a9f30076f7d0?auto=format&fit=crop&w=1800&q=85",
    span: "md:col-span-5",
    ratio: "aspect-[16/11] md:aspect-auto",
  },
  {
    title: "Human Perspective",
    category: "Art Direction / Editorial",
    year: "2025",
    description:
      "A photo-led story system celebrating the texture of everyday experience.",
    image:
      "https://images.unsplash.com/photo-1764295105302-3c239de00917?auto=format&fit=crop&w=1800&q=85",
    span: "md:col-span-5",
    ratio: "aspect-[16/11] md:aspect-auto",
  },
  {
    title: "Brand Identity",
    category: "Strategy / Identity",
    year: "2024",
    description:
      "A flexible identity built to move with an ambitious independent studio.",
    image:
      "https://images.unsplash.com/photo-1718670013988-c6e3edb92345?auto=format&fit=crop&w=1800&q=85",
    span: "md:col-span-7",
    ratio: "aspect-[16/11]",
  },
];

const JOURNAL = [
  {
    title: "Designing for the Moments Between Screens",
    date: "Sep 2, 2026",
    time: "6 min read",
    image: PROJECTS[0].image,
  },
  {
    title: "Why Motion Belongs in the System",
    date: "Jul 18, 2026",
    time: "4 min read",
    image: PROJECTS[1].image,
  },
  {
    title: "Prototypes That Earn Their Place",
    date: "May 29, 2026",
    time: "7 min read",
    image: PROJECTS[2].image,
  },
  {
    title: "Building a Studio Without Losing the Craft",
    date: "Mar 11, 2026",
    time: "5 min read",
    image: PROJECTS[3].image,
  },
];

const EXPLORATIONS: Exploration[] = [
  {
    title: "Chromatic Drift",
    type: "Generative form study",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1536405416754-3bcd4fb38128?auto=format&fit=crop&w=1200&q=85",
    rotation: -4,
  },
  {
    title: "Still / Moving",
    type: "Kinetic type experiment",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1774187251887-e994c80ceddd?auto=format&fit=crop&w=1200&q=85",
    rotation: 5,
  },
  {
    title: "Signal Bloom",
    type: "Audio-reactive study",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1763805508094-901f2a79ff77?auto=format&fit=crop&w=1200&q=85",
    rotation: 3,
  },
  {
    title: "Soft Machines",
    type: "Material and light study",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1758474281193-37cd4ec6fe04?auto=format&fit=crop&w=1200&q=85",
    rotation: -5,
  },
  {
    title: "Between Frames",
    type: "Motion loop",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1768327239454-150805bc0348?auto=format&fit=crop&w=1200&q=85",
    rotation: -3,
  },
  {
    title: "Night Geometry",
    type: "Light and shadow series",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1768212363804-572e17fea502?auto=format&fit=crop&w=1200&q=85",
    rotation: 4,
  },
];

const STATS = [
  { value: "< 1", label: "Years Experience" },
  { value: "3", label: "Projects Done" },
  { value: "200%", label: "Satisfied Clients" },
];

const ROLES = ["Analyst", "Fintech", "Finance", "Student", "Data"];

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const duration = reduceMotion ? 350 : 2700;
    const completionDelay = reduceMotion ? 80 : 400;
    const startedAt = performance.now();
    let frame = 0;
    let timeout = 0;

    const update = (now: number) => {
      const elapsed = now - startedAt;
      const nextCount = Math.min(100, Math.floor((elapsed / duration) * 100));
      setCount(nextCount);
      setWordIndex(Math.floor(elapsed / Math.max(1, duration / 3)) % 3);

      if (nextCount < 100) {
        frame = requestAnimationFrame(update);
      } else {
        timeout = window.setTimeout(onComplete, completionDelay);
      }
    };

    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [onComplete, reduceMotion]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55, ease: EASE } }}
      role="status"
      aria-label="Loading Nguyen Tan Huy portfolio"
    >
      <motion.p
        className="loading-label"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Portfolio
      </motion.p>

      <div className="loading-word" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.38, ease: EASE }}
          >
            {["Design", "Create", "Inspire"][wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <p className="loading-counter" aria-hidden="true">
        {String(count).padStart(3, "0")}
      </p>
      <div className="loading-track" aria-hidden="true">
        <span
          className="loading-progress accent-gradient"
          style={{ transform: "scaleX(" + count / 100 + ")" }}
        />
      </div>
    </motion.div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ids = ["home", "work", "resume"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55%", threshold: [0, 0.2, 0.6] },
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const links = [
    { label: "Home", href: "#home", id: "home" },
    { label: "Work", href: "#work", id: "work" },
    { label: "Resume", href: "#resume", id: "resume" },
  ];

  return (
    <header className="nav-wrap">
      <nav
        className={["nav-pill", scrolled ? "nav-pill-scrolled" : ""].join(
          " ",
        )}
        aria-label="Primary navigation"
      >
        <a className="logo-ring" href="#home" aria-label="Nguyen Tan Huy home">
          <span>MS</span>
        </a>
        <span className="nav-divider" aria-hidden="true" />
        <div className="nav-links">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={active === link.id ? "nav-link active" : "nav-link"}
              aria-current={active === link.id ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
        <span className="nav-divider" aria-hidden="true" />
        <a className="say-hi" href="#contact">
          <span>
            Say hi <span className="arrow-glyph" aria-hidden="true">↗</span>
          </span>
        </a>
      </nav>
    </header>
  );
}

function HlsBackgroundVideo({
  flipped = false,
  lazy = false,
}: {
  flipped?: boolean;
  lazy?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;

    let hls: HlsInstance | null = null;
    let observer: IntersectionObserver | null = null;
    let started = false;
    let cancelled = false;

    const start = async () => {
      if (started || cancelled) {
        if (!cancelled) void video.play().catch(() => undefined);
        return;
      }
      started = true;

      const { default: Hls } = await import("hls.js");
      if (cancelled) return;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
        });
        hls.loadSource(HLS_SOURCE);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!cancelled) void video.play().catch(() => undefined);
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) hls?.destroy();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = HLS_SOURCE;
        void video.play().catch(() => undefined);
      }
    };

    if (lazy) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) void start();
          else video.pause();
        },
        { rootMargin: "300px" },
      );
      observer.observe(video);
    } else {
      void start();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      hls?.destroy();
      video.pause();
    };
  }, [lazy, reduceMotion]);

  return (
    <video
      ref={videoRef}
      className={flipped ? "background-video video-flipped" : "background-video"}
      autoPlay={!reduceMotion}
      muted
      loop
      playsInline
      preload="metadata"
      poster={PROJECTS[0].image}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

function Hero({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (!ready) return;
    const interval = window.setInterval(
      () => setRoleIndex((current) => (current + 1) % ROLES.length),
      2000,
    );
    return () => window.clearInterval(interval);
  }, [ready]);

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    let cancelled = false;
    let context: { revert: () => void } | undefined;

    void import("gsap").then(({ gsap }) => {
      if (cancelled || !rootRef.current) return;
      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline.fromTo(
          ".name-reveal",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.1 },
        );
        timeline.fromTo(
          ".blur-in",
          { opacity: 0, filter: "blur(10px)", y: 20 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1,
            stagger: 0.1,
          },
          "-=0.75",
        );
      }, rootRef);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [ready]);

  return (
    <section id="home" ref={rootRef} className="hero-section">
      <div className="hero-media" aria-hidden="true">
        <HlsBackgroundVideo />
        <div className="hero-overlay" />
        <div className="hero-bottom-fade" />
        <div className="hero-grain" />
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow blur-in">Collection &apos;26</p>
        <h1 className="name-reveal">Nguyen Tan Huy</h1>
        <p className="hero-role blur-in">
          A{" "}
          <span key={roleIndex} className="role-word">
            {ROLES[roleIndex]}
          </span>{" "}
          lives in Ho Chi Minh City.
        </p>
        <p className="hero-description blur-in">
          Designing seamless digital interactions by focusing on the unique
          nuances which bring systems to life.
        </p>
        <div className="hero-actions blur-in">
          <a className="button button-solid" href="#work">
            See Works <span className="arrow-glyph" aria-hidden="true">↓</span>
          </a>
          <a className="button button-outline" href="#contact">
            Reach out <span className="arrow-glyph" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <a className="scroll-indicator blur-in" href="#work">
        <span>Scroll</span>
        <span className="scroll-line" aria-hidden="true">
          <span />
        </span>
      </a>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  italic,
  description,
  action,
  href = "#contact",
}: {
  eyebrow: string;
  title: string;
  italic: string;
  description: string;
  action?: string;
  href?: string;
}) {
  return (
    <motion.div
      className="section-header"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="section-heading-copy">
        <div className="section-eyebrow">
          <span aria-hidden="true" />
          <p>{eyebrow}</p>
        </div>
        <h2>
          {title} <em>{italic}</em>
        </h2>
        <p className="section-description">{description}</p>
      </div>
      {action ? (
        <a className="text-link desktop-action" href={href}>
          {action} <span className="arrow-glyph" aria-hidden="true">→</span>
        </a>
      ) : null}
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      className={["project-card", project.span, project.ratio].join(" ")}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: index * 0.07, ease: EASE }}
      viewport={{ once: true, margin: "-80px" }}
    >
      <a href="#contact" aria-label={"View " + project.title + " project"}>
        <img src={project.image} alt="" loading="lazy" />
        <span className="halftone" aria-hidden="true" />
        <span className="project-shade" aria-hidden="true" />

        <span className="project-meta">
          <span>
            <small>{project.category}</small>
            <strong>{project.title}</strong>
          </span>
          <small>{project.year}</small>
        </span>

        <span className="project-hover">
          <span className="project-hover-pill">
            View — <em>{project.title}</em>
          </span>
        </span>
        <span className="sr-only">{project.description}</span>
      </a>
    </motion.article>
  );
}

function SelectedWorks() {
  return (
    <section id="work" className="content-section works-section">
      <div className="page-shell">
        <SectionHeader
          eyebrow="Selected Work"
          title="Featured"
          italic="projects"
          description="A selection of projects I've worked on, from concept to launch."
          action="View all work"
        />

        <div className="bento-grid">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section id="journal" className="content-section journal-section">
      <div className="page-shell">
        <SectionHeader
          eyebrow="Journal"
          title="Recent"
          italic="thoughts"
          description="Notes on design, technology, and the details that make digital work feel human."
          action="View all"
        />

        <div className="journal-list">
          {JOURNAL.map((entry, index) => (
            <motion.a
              href="#contact"
              className="journal-row"
              key={entry.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: index * 0.06, ease: EASE }}
              viewport={{ once: true, margin: "-60px" }}
            >
              <span className="journal-index">0{index + 1}</span>
              <span className="journal-thumb">
                <img src={entry.image} alt="" loading="lazy" />
              </span>
              <strong>{entry.title}</strong>
              <span className="journal-details">
                <span>{entry.time}</span>
                <span>{entry.date}</span>
              </span>
              <span className="journal-arrow" aria-hidden="true">
                ↗
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExplorationCard({
  item,
  onOpen,
}: {
  item: Exploration;
  onOpen: (item: Exploration, trigger: HTMLButtonElement) => void;
}) {
  return (
    <button
      className="exploration-card"
      style={{ "--card-rotation": item.rotation + "deg" } as CSSProperties}
      onClick={(event) => onOpen(item, event.currentTarget)}
      aria-label={"Open " + item.title + " in lightbox"}
    >
      <img src={item.image} alt={item.title} loading="lazy" />
      <span className="halftone" aria-hidden="true" />
      <span className="exploration-caption">
        <span>
          <strong>{item.title}</strong>
          <small>{item.type}</small>
        </span>
        <small>{item.year}</small>
      </span>
    </button>
  );
}

function Explorations({
  onOpen,
}: {
  onOpen: (item: Exploration, trigger: HTMLButtonElement) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !sectionRef.current || !contentRef.current) return;
    let cancelled = false;
    let context: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled || !sectionRef.current || !contentRef.current) return;
        gsap.registerPlugin(ScrollTrigger);
        context = gsap.context(() => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: contentRef.current,
            pinSpacing: false,
          });

          gsap.fromTo(
            leftRef.current,
            { yPercent: 18 },
            {
              yPercent: -24,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          );
          gsap.fromTo(
            rightRef.current,
            { yPercent: -12 },
            {
              yPercent: 22,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            },
          );
        }, sectionRef);
        window.setTimeout(() => ScrollTrigger.refresh(), 100);
      },
    );

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [reduceMotion]);

  return (
    <section id="explorations" ref={sectionRef} className="explorations-section">
      <div ref={contentRef} className="explorations-center">
        <div className="explorations-copy">
          <div className="section-eyebrow centered">
            <span aria-hidden="true" />
            <p>Explorations</p>
            <span aria-hidden="true" />
          </div>
          <h2>
            Visual <em>playground</em>
          </h2>
          <p>
            Ongoing studies in motion, type, texture, and light—made to follow
            curiosity.
          </p>
          <a className="button button-outline" href="#contact">
            See more experiments <span className="arrow-glyph" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="explorations-gallery" aria-label="Visual experiments">
        <div ref={leftRef} className="parallax-column column-left">
          {EXPLORATIONS.slice(0, 3).map((item) => (
            <ExplorationCard key={item.title} item={item} onOpen={onOpen} />
          ))}
        </div>
        <div ref={rightRef} className="parallax-column column-right">
          {EXPLORATIONS.slice(3).map((item) => (
            <ExplorationCard key={item.title} item={item} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats-section">
      <div className="page-shell stats-grid">
        {STATS.map((stat, index) => (
          <motion.div
            className="stat"
            key={stat.label}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: index * 0.1, ease: EASE }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <span className="stat-number">{stat.value}</span>
            <span className="stat-label">
              <span className="stat-dot" aria-hidden="true" /> {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const phrase = Array.from({ length: 10 }, (_, index) => (
    <span key={index}>BUILDING THE FUTURE • </span>
  ));

  useEffect(() => {
    if (reduceMotion || !marqueeRef.current) return;
    let cancelled = false;
    let tween: { kill: () => void } | undefined;
    void import("gsap").then(({ gsap }) => {
      if (cancelled || !marqueeRef.current) return;
      tween = gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    });
    return () => {
      cancelled = true;
      tween?.kill();
    };
  }, [reduceMotion]);

  return (
    <footer id="contact" className="contact-footer">
      <div className="footer-media" aria-hidden="true">
        <HlsBackgroundVideo flipped lazy />
        <div className="footer-overlay" />
        <div className="hero-grain" />
      </div>

      <div className="marquee-window" aria-hidden="true">
        <div ref={marqueeRef} className="marquee-track">
          <div>{phrase}</div>
          <div>{phrase}</div>
        </div>
      </div>

      <motion.div
        className="footer-cta page-shell"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <p>Have something in mind?</p>
        <h2>
          Let&apos;s build <em>what&apos;s next.</em>
        </h2>
        <p className="footer-description">
          Available for select collaborations, product work, and thoughtful
          experiments.
        </p>
        <a
          className="email-button"
          href="mailto:tanhuypk0204@gmail.com"
          aria-label="Email Nguyen Tan Huy"
        >
          <span>tanhuypk0204@gmail.com</span>
          <span className="arrow-glyph" aria-hidden="true">↗</span>
        </a>
      </motion.div>

      <div className="footer-bar page-shell">
        <p>© 2026 Nguyen Tan Huy</p>
        <div className="social-links" aria-label="Social links">
          {[
            ["Facebook", "https://www.facebook.com/nguyentanhuy.24"],
            ["LinkedIn", "www.linkedin.com/in/ngtanhuy"],
            ["Zalo", "https://zalo.me/09063467179"],
            ["GitHub", "https://github.com/Yuhhy"],
          ].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </div>
        <p className="availability">
          <span aria-hidden="true" /> Available for projects
        </p>
      </div>
    </footer>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: Exploration | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!item) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) onClose();
          }}
        >
          <motion.figure
            className="lightbox-panel"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.38, ease: EASE }}
          >
            <img src={item.image} alt={item.title} />
            <figcaption>
              <span>
                <strong id="lightbox-title">{item.title}</strong>
                <small>{item.type}</small>
              </span>
              <small>{item.year}</small>
            </figcaption>
            <button ref={closeRef} onClick={onClose} aria-label="Close lightbox">
              <span className="close-glyph" aria-hidden="true">×</span>
            </button>
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function PortfolioClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [lightbox, setLightbox] = useState<Exploration | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const finishLoading = useCallback(() => setIsLoading(false), []);
  const openLightbox = useCallback(
    (item: Exploration, trigger: HTMLButtonElement) => {
      lastTriggerRef.current = trigger;
      setLightbox(item);
    },
    [],
  );
  const closeLightbox = useCallback(() => {
    setLightbox(null);
    window.setTimeout(() => lastTriggerRef.current?.focus(), 0);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{isLoading ? <LoadingScreen onComplete={finishLoading} /> : null}</AnimatePresence>
      <div inert={isLoading} aria-hidden={isLoading}>
        <Navbar />
      </div>
      <main inert={isLoading} aria-hidden={isLoading}>
        <Hero ready={!isLoading} />
        <SelectedWorks />
        <Journal />
        <Explorations onOpen={openLightbox} />
        <Stats />
        <Resume />
      </main>
      <div inert={isLoading} aria-hidden={isLoading}>
        <Footer />
      </div>
      <Lightbox item={lightbox} onClose={closeLightbox} />
    </MotionConfig>
  );
}
