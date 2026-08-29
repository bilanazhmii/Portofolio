'use client';

import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';

import {
  ArrowDownRight,
  ArrowUpRight,
  AtSign,
  Bike,
  Code2,
  Cpu,
  ExternalLink,
  Gamepad2,
  GraduationCap,
  Mail,
  Menu,
  MoveUpRight,
  Server,
  Users,
  X,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

const categories = ['All', 'TypeScript', 'JavaScript'] as const;
type Category = (typeof categories)[number];

const navItems = [['home', 'Home'], ['work', 'Work'], ['about', 'Process'], ['profile', 'Profile'], ['contact', 'Contact']] as const;

const secretClues = [
  { id: 'note', letter: 'N', title: 'Personal note' },
  { id: 'arabic', letter: 'A', title: 'Arabic, read in full' },
  { id: 'before', letter: 'B', title: 'Before success' },
  { id: 'iteration', letter: 'I', title: 'Iteration' },
  { id: 'lembang', letter: 'L', title: 'Lembang' },
  { id: 'aeternum', letter: 'A', title: 'Aeternum' },
] as const;
type SecretClueId = (typeof secretClues)[number]['id'];

const quoteSlides = [
  {
    id: 'arabic',
    label: 'العربية',
    language: 'ar',
    phrase: 'الصبر قبل النجاح',
    reply: '— منها: «أستطيع أن أصبر 😊»',
    note: 'Aṣ-ṣabru qabla an-najāḥ · Astaṭīʿu an aṣbir',
  },
  {
    id: 'indonesian',
    label: 'Indonesia',
    language: 'id',
    phrase: 'Kesabaran datang sebelum keberhasilan.',
    reply: '— darinya: “Aku bisa bersabar 😊”',
    note: 'Terjemahan bahasa Indonesia',
  },
  {
    id: 'english',
    label: 'English',
    language: 'en',
    phrase: 'Patience comes before success.',
    reply: '— from her: “I can be patient 😊”',
    note: 'English translation',
  },
] as const;

const projects = [
  { number: '01', title: 'SchoolDMS', type: 'Document management', category: 'TypeScript', updated: 'Aug 22, 2026', className: 'project-svara', mark: 'DMS', caption: 'A connected document-management platform for school workflows.', overview: 'A connected document-management platform for school workflows, combining a Next.js interface, NestJS API, Prisma data layer, cloud storage, and sync tooling.', services: ['TypeScript', 'Next.js', 'NestJS', 'Prisma', 'Supabase'], repoUrl: 'https://github.com/bilanazhmii/SchoolDMS', liveUrl: 'https://school-dms.vercel.app/' },
  { number: '02', title: 'Our-bisnis', type: 'Business operations PWA', category: 'JavaScript', updated: 'Aug 23, 2026', className: 'project-north', mark: 'OB', caption: 'A PWA for day-to-day business operations.', overview: 'A PWA for day-to-day business operations: sales, inventory, cash flow, receivables, reports, receipts, roles, and secure cross-device sync.', services: ['JavaScript', 'Supabase', 'PWA', 'RLS', 'Offline-first'], repoUrl: 'https://github.com/bilanazhmii/Our-bisnis', liveUrl: 'https://our-bisnis.vercel.app/' },
  { number: '03', title: 'MyPortofolio', type: 'Immersive 3D portfolio', category: 'TypeScript', updated: 'Aug 23, 2026', className: 'project-ruang', mark: '3D', caption: 'An immersive 3D portfolio with motion and spatial interaction.', overview: 'An immersive 3D portfolio with motion, spatial interaction, and a cinematic WebGL experience.', services: ['TypeScript', '3D', 'WebGL'], repoUrl: 'https://github.com/bilanazhmii/MyPortofolio', liveUrl: 'https://myportofolio-bila-la.vercel.app' },
  { number: '04', title: 'BotIndo', type: 'Operations bot', category: 'JavaScript', updated: 'Jul 27, 2026', className: 'project-common', mark: 'BOT', caption: 'A Discord and Minecraft operations bot.', overview: 'A Discord and Minecraft operations bot with RCON, server status, commands, AI utilities, and a web dashboard.', services: ['JavaScript', 'Discord', 'Minecraft', 'RCON'], repoUrl: 'https://github.com/bilanazhmii/BotIndo', liveUrl: null },
] as const;
type Project = (typeof projects)[number];

function setTilt(event: ReactPointerEvent<HTMLElement>, strength = 7) {
  if (event.pointerType === 'touch') return;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  event.currentTarget.style.setProperty('--tilt-x', `${y * -strength}deg`);
  event.currentTarget.style.setProperty('--tilt-y', `${x * strength}deg`);
  event.currentTarget.style.setProperty('--hover-x', `${(x + 0.5) * 100}%`);
  event.currentTarget.style.setProperty('--hover-y', `${(y + 0.5) * 100}%`);
}

function resetTilt(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg');
  event.currentTarget.style.setProperty('--tilt-y', '0deg');
}

export default function Home() {
  const [category, setCategory] = useState<Category>('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [identityOpen, setIdentityOpen] = useState(false);
  const [identityVisible, setIdentityVisible] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [foundClues, setFoundClues] = useState<SecretClueId[]>([]);
  const [clueToast, setClueToast] = useState<SecretClueId | null>(null);
  const [secretOpen, setSecretOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const clickPulseRef = useRef<HTMLSpanElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const identityCloseRef = useRef<HTMLButtonElement>(null);
  const identityTriggerRef = useRef<HTMLButtonElement>(null);
  const lastProjectTriggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number>(0);
  const identityTimerRef = useRef<number>(0);
  const clueToastTimerRef = useRef<number>(0);
  const secretRevealTimerRef = useRef<number>(0);
  const typedSecretRef = useRef('');

  const visibleProjects = useMemo(() => projects.filter((project) => category === 'All' || project.category === category), [category]);
  const completedSecret = foundClues.length === secretClues.length;

  const discoverClue = useCallback((id: SecretClueId) => {
    if (foundClues.includes(id)) return;
    const next = [...foundClues, id];
    setFoundClues(next);
    window.localStorage.setItem('bilanium-secret-clues', JSON.stringify(next));
    setClueToast(id);
    window.clearTimeout(clueToastTimerRef.current);
    clueToastTimerRef.current = window.setTimeout(() => setClueToast(null), 2600);

    if (next.length === secretClues.length) {
      window.clearTimeout(secretRevealTimerRef.current);
      secretRevealTimerRef.current = window.setTimeout(() => {
        setIdentityVisible(false);
        setIdentityOpen(false);
        setSelectedProject(null);
        setSecretOpen(true);
      }, 950);
    }
  }, [foundClues]);

  const closeProject = useCallback(() => {
    if (!selectedProject) return;
    setModalOpen(false);
    window.clearTimeout(closeTimerRef.current);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420;
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedProject(null);
      lastProjectTriggerRef.current?.focus();
    }, delay);
  }, [selectedProject]);

  const openProject = (project: Project, event: ReactMouseEvent<HTMLButtonElement>) => {
    lastProjectTriggerRef.current = event.currentTarget;
    setSelectedProject(project);
  };

  const openIdentity = () => {
    discoverClue('note');
    setQuoteIndex(0);
    setIdentityOpen(true);
  };

  const closeIdentity = useCallback(() => {
    if (!identityOpen) return;
    setIdentityVisible(false);
    window.clearTimeout(identityTimerRef.current);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420;
    identityTimerRef.current = window.setTimeout(() => {
      setIdentityOpen(false);
      identityTriggerRef.current?.focus();
    }, delay);
  }, [identityOpen]);

  const showNextQuote = () => setQuoteIndex((current) => {
    const next = (current + 1) % quoteSlides.length;
    if (next === 0) discoverClue('arabic');
    return next;
  });

  const revealSecret = useCallback(() => {
    const allClues = secretClues.map((clue) => clue.id);
    setFoundClues(allClues);
    window.localStorage.setItem('bilanium-secret-clues', JSON.stringify(allClues));
    setIdentityOpen(false);
    setSelectedProject(null);
    setSecretOpen(true);
  }, []);

  const resetSecret = () => {
    setSecretOpen(false);
    setFoundClues([]);
    setClueToast(null);
    window.localStorage.removeItem('bilanium-secret-clues');
  };

  const showClickPulse = (event: ReactPointerEvent<HTMLElement>) => {
    const target = (event.target as HTMLElement).closest('a, button');
    const pulse = clickPulseRef.current;
    if (!target || !pulse) return;
    pulse.style.left = `${event.clientX}px`;
    pulse.style.top = `${event.clientY}px`;
    pulse.classList.remove('is-clicked');
    void pulse.offsetWidth;
    pulse.classList.add('is-clicked');
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(window.localStorage.getItem('bilanium-secret-clues') ?? '[]') as string[];
        const valid = stored.filter((id): id is SecretClueId => secretClues.some((clue) => clue.id === id));
        setFoundClues([...new Set(valid)]);
      } catch {
        window.localStorage.removeItem('bilanium-secret-clues');
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = mainRef.current;
    const cursor = cursorRef.current;
    if (!root || !cursor) return;
    const finePointer = window.matchMedia('(pointer: fine)');
    let frame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const renderPointer = () => {
      root.style.setProperty('--pointer-x', `${pointerX}px`);
      root.style.setProperty('--pointer-y', `${pointerY}px`);
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      frame = 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.dataset.visible = finePointer.matches ? 'true' : 'false';
      if (!frame) frame = window.requestAnimationFrame(renderPointer);
    };
    const onPointerOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
      cursor.dataset.active = target ? 'true' : 'false';
      cursor.textContent = target?.dataset.cursor ?? '';
    };
    const onPointerLeave = () => { cursor.dataset.visible = 'false'; };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.documentElement.removeEventListener('mouseleave', onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const sections = navItems.map(([id]) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: '-28% 0px -58%', threshold: [0, 0.15, 0.4] });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10%', threshold: 0.12 });
    sections.forEach((section) => sectionObserver.observe(section));
    revealItems.forEach((item) => reduceMotion ? item.classList.add('is-visible') : revealObserver.observe(item));

    const updateProgress = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const value = distance > 0 ? window.scrollY / distance : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${value})`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => {
      sectionObserver.disconnect();
      revealObserver.disconnect();
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (secretOpen) return;
        if (identityOpen) closeIdentity();
        else if (selectedProject) closeProject();
        else setMenuOpen(false);
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]') || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1) return;
      typedSecretRef.current = `${typedSecretRef.current}${event.key.toUpperCase()}`.slice(-6);
      if (typedSecretRef.current === 'NABILA') revealSecret();
    };
    window.addEventListener('keydown', closeMenu);
    return () => window.removeEventListener('keydown', closeMenu);
  }, [closeIdentity, closeProject, identityOpen, revealSecret, secretOpen, selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => {
      setModalOpen(true);
      modalCloseRef.current?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!identityOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => {
      setIdentityVisible(true);
      identityCloseRef.current?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [identityOpen]);

  useEffect(() => () => {
    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(identityTimerRef.current);
    window.clearTimeout(clueToastTimerRef.current);
    window.clearTimeout(secretRevealTimerRef.current);
  }, []);

  return (
    <main ref={mainRef} onPointerDownCapture={showClickPulse}>
      <a className="skip-link" href="#work">Skip to selected work</a>
      <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>
      <div className="cursor-orbit" ref={cursorRef} aria-hidden="true" />
      <span className="click-pulse" ref={clickPulseRef} aria-hidden="true" />
      {foundClues.length > 0 && (
        <aside className={`secret-progress ${completedSecret ? 'is-complete' : ''}`} aria-label={`${foundClues.length} of ${secretClues.length} hidden letters found`}>
          <span>Quiet coordinates</span>
          <div aria-hidden="true">
            {secretClues.map((clue) => <i className={foundClues.includes(clue.id) ? 'is-found' : ''} key={clue.id}>{foundClues.includes(clue.id) ? clue.letter : '·'}</i>)}
          </div>
          {completedSecret ? <button type="button" onClick={() => setSecretOpen(true)}>Open the archive ↗</button> : <small>{foundClues.length}/6 · keep looking</small>}
        </aside>
      )}
      <output className={`clue-toast ${clueToast ? 'is-visible' : ''}`} aria-live="polite">
        {clueToast && <><span>Clue found</span><strong>{secretClues.find((clue) => clue.id === clueToast)?.letter} / {secretClues.find((clue) => clue.id === clueToast)?.title}</strong></>}
      </output>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="BilaNiumN1 home" data-cursor="Home"><span className="brand-avatar"><Image src="/irga-profile.jpg" alt="" width={38} height={38} priority /></span><strong>BILANIUMN1</strong></a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Primary navigation">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={activeSection === id ? 'is-active' : ''} aria-current={activeSection === id ? 'location' : undefined} onClick={() => setMenuOpen(false)}><span>{label}</span></a>
          ))}
        </nav>
        <a className="availability" href="https://github.com/bilanazhmii?tab=repositories" target="_blank" rel="noreferrer" data-cursor="GitHub"><i /> 6 public repositories</a>
        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero shell" id="home">
        <div className="hero-aura" aria-hidden="true" />
        <div className="eyebrow hero-enter hero-enter-1">
          <span>Student developer / systems builder</span>
          <button className="location-clue" type="button" onClick={() => discoverClue('lembang')} aria-label="Inspect the Lembang location marker"><span>Lembang <b>/ Indonesia</b></span><i aria-hidden="true">L</i></button>
        </div>
        <div className="hero-grid">
          <div className="card-stage hero-enter hero-enter-2">
            <div className="identity-card" data-cursor="Open note" onPointerMove={(event) => setTilt(event, 9)} onPointerLeave={resetTilt}>
              <div className="lanyard" />
              <div className="identity-top"><span><i /> IRGA / 17</span><span>SOMNIUM ID · 2026</span></div>
              <div className="identity-portrait">
                <Image className="identity-photo" src="/irga-profile.jpg" alt="A red rose held in warm evening light" width={460} height={460} sizes="(max-width: 520px) 76vw, 318px" priority />
                <span className="identity-portrait-index">01 / STUDENT BUILDER</span>
              </div>
              <div className="identity-bottom">
                <div><small>Systems · products · community</small><strong>Irga Andreansyah<br />Setiawan</strong></div>
                <span className="identity-seal">IA<i>06</i></span>
              </div>
              <button ref={identityTriggerRef} className="identity-hit" type="button" aria-haspopup="dialog" aria-label="Open personal quote and translations" onClick={openIdentity}>
                <span>Personal note / tap to translate</span><strong>الصبر قبل النجاح <i>↗</i></strong>
              </button>
              <span className="identity-serial" aria-hidden="true">N1 / LEMBANG / 2026</span>
              <div className="card-glare" aria-hidden="true" />
            </div>
            <span className="card-note">MOVE · CLICK · READ ↗</span>
          </div>
          <div className="hero-copy">
            <p className="hero-enter hero-enter-2">Student developer &amp; systems builder <span className="hero-handle">/ Lembang, ID</span></p>
            <h1 aria-label="Useful digital products, thoughtfully built">
              <span className="title-line hero-enter hero-enter-3"><span>Useful products,</span></span>
              <span className="title-line title-line-accent hero-enter hero-enter-4"><span>thoughtfully built.</span></span>
            </h1>
            <div className="hero-detail hero-enter hero-enter-5">
              <p>Hello, I&apos;m <strong>Irga Andreansyah Setiawan.</strong> A 17-year-old informatics student turning everyday problems into useful products, reliable systems, and practical infrastructure.</p>
              <a className="primary-button" href="#work" data-cursor="Explore" onPointerMove={(event) => setTilt(event, 3)} onPointerLeave={resetTilt}><span>Explore selected work</span><ArrowDownRight /></a>
            </div>
          </div>
        </div>
        <div className="hero-foot hero-enter hero-enter-5"><span>Web products</span><span>Linux systems</span><span>Community technology</span><span>© 2026</span></div>
      </section>

      <div className="profile-facts shell" aria-label="Personal profile facts">
        <div><strong>17</strong><span>Informatics student</span></div>
        <div><strong>OSIS 06</strong><span>Communication &amp; information</span></div>
        <div><strong>Kali / W11</strong><span>Dual-boot systems builder</span></div>
      </div>

      <div className="motion-rail shell" aria-label="Creative services">
        <div className="motion-track">
          {[0, 1].map((copy) => (
            <div className="motion-copy" aria-hidden={copy === 1} key={copy}><span>Web products</span><i>✦</i><span>Linux systems</span><i>✦</i><span>Infrastructure</span><i>✦</i><span>Community technology</span><i>✦</i><span>Responsible security</span><i>✦</i></div>
          ))}
        </div>
      </div>

      <section className="work shell" id="work">
        <div className="section-heading" data-reveal>
          <div><span className="section-index">01 / SELECTED WORK</span><h2><span>Built for</span><em>real use.</em></h2></div>
          <p>A focused selection of public projects—each shaped around an actual workflow, a clear purpose, and a maintainable technical foundation.</p>
        </div>
        <div className="work-toolbar" data-reveal>
          <fieldset className="filters" aria-label="Filter projects">
            {categories.map((item) => (
              <button key={item} type="button" className={category === item ? 'is-active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}><span>{item}</span><small>{item === 'All' ? projects.length : projects.filter((project) => project.category === item).length}</small></button>
            ))}
          </fieldset>
          <span className="project-count" aria-live="polite">Showing {visibleProjects.length.toString().padStart(2, '0')} projects</span>
        </div>
        <div className="project-grid" key={category}>
          {visibleProjects.map((project, index) => (
            <article className="project-card" key={project.title} style={{ '--delay': `${index * 85}ms` } as CSSProperties} data-cursor={`Project ${project.number}`} onPointerMove={(event) => setTilt(event, 4)} onPointerLeave={resetTilt}>
              <div className={`project-visual ${project.className}`}>
                <span className="project-number">{project.number}</span><span className="project-mark">{project.mark}</span><span className="project-category">{project.category}</span><ArrowUpRight className="project-arrow" />
                <span className="project-scanline" aria-hidden="true" /><span className="project-glare" aria-hidden="true" />
              </div>
              <div className="project-info"><div><span className="project-kicker">Project {project.number} / Public build</span><h3>{project.title}</h3><p>{project.caption}</p></div><div><span>{project.category}</span><span>{project.updated}</span><span className="project-open">Open project ↗</span></div></div>
              <button className="project-hit" type="button" aria-haspopup="dialog" aria-label={`Open ${project.title} project preview`} onClick={(event) => openProject(project, event)} />
              {project.number === '03' && <button className="clue-trigger clue-project" type="button" aria-label="Inspect the before-success marker" onClick={() => discoverClue('before')}><span aria-hidden="true">B</span><small>before success</small></button>}
            </article>
          ))}
        </div>
      </section>

      <section className="about shell" id="about">
        <div className="section-heading about-heading" data-reveal>
          <div><span className="section-index">02 / HOW I BUILD</span><h2><span>Clarity first.</span><span>Systems that last.</span></h2></div>
          <p>I care about the details between an idea and a product people can actually use: thoughtful UX, sensible architecture, resilient data flows, and continuous refinement.</p>
        </div>
        <div className="capabilities">
          {[
            ['01', 'Product clarity', 'Start with the real workflow, then remove friction until the experience feels obvious.'],
            ['02', 'System thinking', 'Connect interface, API, data, security, and deployment as one coherent product.'],
            ['03', 'Iterative craft', 'Ship, observe, refine, and keep the implementation as intentional as the design.'],
          ].map(([number, title, detail], index) => (
            <div className="capability" key={number} data-reveal style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}><span>{number}</span><h3>{title}</h3><p>{detail}</p>{index === 2 ? <button className="clue-trigger clue-iteration" type="button" aria-label="Inspect the iteration marker" onClick={() => discoverClue('iteration')}><span aria-hidden="true">I</span></button> : <MoveUpRight aria-hidden="true" />}</div>
          ))}
        </div>
      </section>

      <section className="journey shell" id="profile">
        <div className="section-heading journey-heading" data-reveal>
          <div><span className="section-index">03 / FIELD NOTES</span><h2><span>Still learning.</span><em>Already building.</em></h2></div>
          <p>School, community work, Linux, servers, and curiosity all meet in the same practice: understand the system, solve the real problem, then share what works.</p>
        </div>
        <div className="journey-list">
          <article className="journey-row" data-reveal>
            <span className="journey-number">01</span>
            <div className="journey-title"><Users aria-hidden="true" /><small>Now / Community</small><h3>SMK Informatika × OSIS Kominfo</h3></div>
            <p>A 17-year-old vocational informatics student serving in OSIS Communication &amp; Information, Sekbid 6—turning school activity into useful digital communication.</p>
            <a href="https://osissmktest.biezz.my.id" target="_blank" rel="noreferrer">Visit the OSIS website <ArrowUpRight /></a>
          </article>
          <article className="journey-row" data-reveal style={{ '--reveal-delay': '70ms' } as CSSProperties}>
            <span className="journey-number">02</span>
            <div className="journey-title"><Cpu aria-hidden="true" /><small>Systems / Linux</small><h3>Debugging below the interface</h3></div>
            <p>Runs Windows 11 and Kali Linux 2026.3 in dual boot on a Lenovo LOQ, works with KDE Plasma and Wayland, and resolved a nouveau/NVIDIA conflict on an RTX 4050 system.</p>
            <div className="journey-tags" aria-label="System environment"><span>Kali Linux</span><span>KDE</span><span>Wayland</span><span>NVIDIA</span></div>
          </article>
          <article className="journey-row" data-reveal style={{ '--reveal-delay': '140ms' } as CSSProperties}>
            <span className="journey-number">03</span>
            <div className="journey-title"><Server aria-hidden="true" /><small>Infrastructure / Practice</small><h3>Servers learned by running them</h3></div>
            <p>Built game-server panels, hosted Minecraft servers, and exposed services through a public IP—learning networking, Linux administration, deployment, and reliability by doing.</p>
            <div className="journey-tags" aria-label="Infrastructure interests"><span>Self-hosting</span><span>Networking</span><span>Game servers</span></div>
          </article>
          <article className="journey-row" data-reveal style={{ '--reveal-delay': '210ms' } as CSSProperties}>
            <span className="journey-number">04</span>
            <div className="journey-title"><GraduationCap aria-hidden="true" /><small>Foundation / Education</small><h3>Discipline before acceleration</h3></div>
            <p>An alumnus of Pesantren Nurul Ilmi Garut, with earlier roots at SDIT Firdaus Lembang–Andir. That foundation continues to shape a patient, responsible way of learning technology.</p>
            <a href="https://nurulilmi.org/" target="_blank" rel="noreferrer">Pesantren Nurul Ilmi <ArrowUpRight /></a>
          </article>
        </div>
        <div className="offscreen-note" data-reveal>
          <div><Gamepad2 aria-hidden="true" /><span>OFF SCREEN / 01</span><p>CS2, Minecraft, and the curiosity to understand what keeps a world running.</p></div>
          <div><Bike aria-hidden="true" /><span>OFF SCREEN / 02</span><p>Riding an R25 V3 today—with ZX and H2R living on the long-term dream list.</p></div>
        </div>
        <p className="responsible-note" data-reveal>Security curiosity is now directed toward defensive testing, system hardening, and responsible experiments inside controlled environments.</p>
      </section>

      <section className="contact shell" id="contact">
        <div className="contact-aura" aria-hidden="true" />
        <div className="contact-layout" data-reveal>
          <div className="contact-heading">
            <span className="section-index">04 / CONNECT</span>
            <h2><span>Designed with</span><span>intention.</span><span>Built through <em>iteration.</em></span></h2>
          </div>
          <div className="contact-body">
            <p>If you are building something useful, have an interesting technical problem, or want to exchange ideas, feel free to reach out.</p>
            <div className="contact-actions">
              <a href="mailto:bilaniumn1@gmail.com" data-cursor="Email"><Mail /><span><small>Email</small>bilaniumn1@gmail.com</span></a>
              <a href="https://github.com/bilanazhmii" target="_blank" rel="noreferrer" data-cursor="GitHub"><Code2 /><span><small>GitHub</small>@bilanazhmii</span></a>
              <a href="https://www.instagram.com/tell.hack/" target="_blank" rel="noreferrer" data-cursor="Instagram"><AtSign /><span><small>Instagram</small>@Tell.hack</span></a>
              <a href="https://orcid.org/0009-0004-5857-3394" target="_blank" rel="noreferrer" data-cursor="ORCID"><ExternalLink /><span><small>Research identity</small>ORCID</span></a>
            </div>
            <button className="aeternum-trigger" type="button" aria-label="Inspect the meaning of Aeternum" onClick={() => discoverClue('aeternum')}><span>AETERNUM</span><i>what is meant to remain</i><strong>A</strong></button>
          </div>
        </div>
        <footer><span>IRGA ANDREANSYAH SETIAWAN — DEVELOPER PORTFOLIO</span><span>SOMNIUM / 2026</span><a href="#home">BACK TO TOP ↑</a></footer>
      </section>

      {selectedProject && (
        <div className={`project-modal ${modalOpen ? 'is-open' : ''}`} onPointerDown={(event) => { if (event.target === event.currentTarget) closeProject(); }}>
          <dialog className="project-dialog" open aria-modal="true" aria-labelledby="project-dialog-title">
            <button className="modal-close" ref={modalCloseRef} type="button" aria-label="Close project preview" onClick={closeProject} data-cursor="Close"><X /></button>
            <div className={`modal-visual ${selectedProject.className}`}>
              <span className="modal-index">REPOSITORY / {selectedProject.number}</span>
              <span className="project-mark">{selectedProject.mark}</span>
              <span className="modal-year">UPDATED {selectedProject.updated}</span>
            </div>
            <div className="modal-content">
              <div className="modal-kicker"><span>Public repository</span><span>{selectedProject.category}</span></div>
              <h2 id="project-dialog-title">{selectedProject.title}</h2>
              <p className="modal-overview">{selectedProject.overview}</p>
              <div className="modal-meta">
                <div><span>Project type</span><strong>{selectedProject.type}</strong></div>
                <div><span>Primary language</span><strong>{selectedProject.category}</strong></div>
              </div>
              <div className="modal-services" aria-label="Project services">{selectedProject.services.map((service) => <span key={service}>{service}</span>)}</div>
              <div className="modal-actions">
                <a href={selectedProject.repoUrl} target="_blank" rel="noreferrer"><Code2 /> Source code</a>
                {selectedProject.liveUrl && <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer"><ExternalLink /> Live product</a>}
              </div>
              <p className="modal-note">Source: public GitHub profile, repository metadata, and README.</p>
            </div>
          </dialog>
        </div>
      )}

      {identityOpen && (
        <div className={`identity-modal ${identityVisible ? 'is-open' : ''}`} onPointerDown={(event) => { if (event.target === event.currentTarget) closeIdentity(); }}>
          <dialog className="identity-dialog" open aria-modal="true" aria-labelledby="identity-dialog-title">
            <button className="identity-modal-close" ref={identityCloseRef} type="button" aria-label="Close personal note" onClick={closeIdentity} data-cursor="Close"><X /></button>
            <aside className="quote-sidebar" aria-label="Quote context">
              <span>PERSONAL NOTE / 01</span>
              <div>
                <p>One note.<br />More than one meaning.</p>
                <small>Read every language. The beginning returns only after the full circle.</small>
              </div>
              <ol aria-label="Available languages">
                {quoteSlides.map((slide, index) => <li className={index === quoteIndex ? 'is-active' : ''} key={slide.id}><span>0{index + 1}</span>{slide.label}</li>)}
              </ol>
            </aside>
            <div className="quote-stage">
              <span className="quote-orbit quote-orbit-one" aria-hidden="true" />
              <span className="quote-orbit quote-orbit-two" aria-hidden="true" />
              <button className="quote-canvas" type="button" aria-label="Show next translation" onClick={showNextQuote} data-cursor="Translate">
                <span className="quote-language">{quoteSlides[quoteIndex].label} · 0{quoteIndex + 1}/03</span>
                <span className="quote-roll" key={quoteSlides[quoteIndex].id} aria-live="polite" lang={quoteSlides[quoteIndex].language} dir={quoteSlides[quoteIndex].language === 'ar' ? 'rtl' : 'ltr'}>
                  <strong id="identity-dialog-title">{quoteSlides[quoteIndex].phrase}</strong>
                  <em>{quoteSlides[quoteIndex].reply}</em>
                  <small>{quoteSlides[quoteIndex].note}</small>
                </span>
                <span className="quote-instruction"><i /> Click to translate <ArrowDownRight /></span>
              </button>
            </div>
          </dialog>
        </div>
      )}

      <Dialog open={secretOpen} onOpenChange={setSecretOpen}>
        <DialogContent showCloseButton={false} className="secret-dialog">
          <DialogTitle className="secret-title">The Favorite Lady</DialogTitle>
          <DialogDescription className="sr-only">A private archive unlocked by discovering the six letters of Nabila.</DialogDescription>
          <button className="secret-close" type="button" aria-label="Close The Favorite Lady archive" onClick={() => setSecretOpen(false)}><X /></button>
          <div className="secret-topline"><span>PRIVATE ARCHIVE / 06 OF 06</span><strong>N · A · B · I · L · A</strong></div>
          <div className="secret-intro">
            <span className="secret-monogram" aria-hidden="true">N</span>
            <div>
              <p>For the person hidden between the details.</p>
              <h2>Nabila Nazhmi<br />Dhi&apos;ulHaq</h2>
              <a href="https://www.instagram.com/bilanazhmii/" target="_blank" rel="noreferrer"><AtSign /> @bilanazhmii</a>
            </div>
          </div>
          <p className="secret-thesis">Some people are not merely part of the story. They are the quiet reason it keeps being written.</p>
          <div className="secret-lexicon">
            <article>
              <span>01 / SOMNIUM</span>
              <strong>Dream</strong>
              <p>A name she gave to the place where an idea first learns how to exist.</p>
            </article>
            <article>
              <span>02 / AETERNUM</span>
              <strong>Forever</strong>
              <p>A name for the meaning that remains after a moment has passed.</p>
            </article>
          </div>
          <div className="secret-signature">
            <div><span>ARCHIVED BY</span><strong>Irga Andreansyah Setiawan</strong><a href="https://www.instagram.com/tell.hack/" target="_blank" rel="noreferrer"><AtSign /> @Tell.hack</a></div>
            <blockquote><span>الصبر قبل النجاح</span><p>Aṣ-ṣabru qabla an-najāḥ.</p><cite>— from her: “Astaṭīʿu an aṣbir 😊”</cite></blockquote>
          </div>
          <div className="secret-footer"><span>SOMNIUM → AETERNUM</span><button type="button" onClick={resetSecret}>Hide every clue again</button></div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
