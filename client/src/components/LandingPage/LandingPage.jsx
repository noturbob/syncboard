import React, { useEffect, useRef } from 'react';

// --- INTERSECTION OBSERVER HOOK ---
const useScrollAnimation = (rootMargin = '0px', threshold = 0.2) => {
    const elementsRef = useRef([]);
    useEffect(() => {
        const currentElements = elementsRef.current;
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    target.classList.remove('slide-up', 'slide-left', 'slide-right', 'fade-in');
                    obs.unobserve(target);
                }
            });
        }, { root: null, rootMargin, threshold });
        currentElements.forEach(el => {
            if (el) observer.observe(el);
        });
        return () => {
            if (currentElements) {
                currentElements.forEach(el => {
                    if (el) observer.unobserve(el);
                });
            }
        };
    }, [rootMargin, threshold]);
    return (el) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };
};

// --- MAIN REACT COMPONENT ---
const LandingPage = () => {
    const refForAnimation = useScrollAnimation();
    const heroRefs = {
        tagline: useRef(null), title: useRef(null), subtitle: useRef(null),
        ctaGroup: useRef(null), board: useRef(null),
    };

    useEffect(() => {
        const delays = { tagline: 100, title: 200, subtitle: 300, ctaGroup: 400, board: 600 };
        const animate = (ref, className, delay) => {
            if (ref.current) {
                setTimeout(() => {
                    ref.current.classList.remove(className);
                }, delay);
            }
        };
        animate(heroRefs.tagline, 'fade-in', delays.tagline);
        animate(heroRefs.title, 'fade-in', delays.title);
        animate(heroRefs.subtitle, 'fade-in', delays.subtitle);
        animate(heroRefs.ctaGroup, 'fade-in', delays.ctaGroup);
        if (heroRefs.board.current) {
             setTimeout(() => {
                heroRefs.board.current.classList.remove('fade-in', 'slide-up');
                heroRefs.board.current.style.removeProperty('transition-delay');
            }, delays.board);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const IconProps = { className: "w-6 h-6 text-white", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" };
    const LayoutDashboard = () => (<svg {...IconProps}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>);
    const Users = () => (<svg {...IconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M19 21v-2a4 4 0 0 0-3-3.75"/><path d="M22 8v2"/></svg>);
    const Code = () => (<svg {...IconProps}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
    const CalendarCheck = () => (<svg {...IconProps}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2l4-4"/></svg>);
    const Layers = () => (<svg {...IconProps}><path d="M12 1.5L2 6l10 4.5 10-4.5L12 1.5z"/><path d="M2 15l10 4.5 10-4.5"/><path d="M2 10.5l10 4.5 10-4.5"/></svg>);
    const Zap = () => (<svg {...IconProps}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);

    const features = [
        { Icon: LayoutDashboard, title: "True Infinite Canvas", desc: "A truly limitless space for drawing, diagramming, and organizing ideas with sticky notes, shapes, and media embeds." },
        { Icon: Users, title: "Instant Co-creation", desc: "Watch ideas unfold with zero latency. Every stroke, shape manipulation, and cursor movement is synchronized instantly." },
        { Icon: Code, title: "Embedded Tools & Media", desc: "Seamlessly embed documents, videos, live code blocks, and prototypes directly onto your canvas for contextual review." },
        { Icon: CalendarCheck, title: "Agile Integration", desc: "Convert sticky notes and diagrams directly into trackable tasks in Jira, Trello, and GitHub with our powerful API." },
        { Icon: Layers, title: "Layered Permissions", desc: "Maintain control over your sensitive project whiteboards with granular role-based access for every collaborator." },
        { Icon: Zap, title: "AI Diagram Generation", desc: "Use AI to instantly transform rough sketches into flowcharts, generate sticky notes from meeting transcripts, or clean up messy diagrams." },
    ];

    return (
        <div className="bg-primary text-highlight max-w-full overflow-x-hidden font-sans">
            <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-accent-dark/50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold tracking-tight text-accent">
                        <span className="text-highlight">Sync</span>Board
                    </div>
                    <div className="hidden md:flex space-x-6 text-sm font-medium text-subtle">
                        <a href="#features" className="hover:text-accent transition">Features</a>
                        <a href="#contact" className="hover:text-accent transition">Contact</a>
                    </div>
                    <a href="/login" className="bg-accent-dark hover:bg-accent text-white font-semibold py-2 px-4 rounded-lg transition shadow-md shadow-accent-dark/30">
                        Login
                    </a>
                </nav>
            </header>

            <main>
                <section className="relative pt-16 pb-24 md:pt-32 md:pb-40 overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#2c2a4b_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <p ref={heroRefs.tagline} className="fade-in inline-block text-sm font-medium text-accent bg-accent-dark/30 rounded-full px-3 py-1 mb-4 shadow-lg shadow-accent-dark/50">
                            Collaborate, Create, Sync
                        </p>
                        <h1 ref={heroRefs.title} className="fade-in text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
                            The Real-Time <br className="hidden sm:inline" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500">Collaborative Whiteboard</span> for Teams.
                        </h1>
                        <p ref={heroRefs.subtitle} className="fade-in max-w-3xl mx-auto text-lg sm:text-xl text-subtle mb-10">
                            SyncBoard is the infinite digital canvas for modern teams, enabling real-time drawing, planning, and brainstorming from anywhere.
                        </p>
                        <div ref={heroRefs.ctaGroup} className="fade-in flex justify-center space-x-4 mb-20">
                            <a href="/signup" className="btn-pulse relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-accent-dark rounded-xl hover:bg-accent transition duration-300 shadow-2xl shadow-accent-dark/50 overflow-hidden">
                                Start Whiteboarding Now
                            </a>
                        </div>
                        <div ref={heroRefs.board} className="fade-in slide-up" style={{ transitionDelay: '500ms' }}>
                            <div className="relative rounded-2xl border border-accent/50 shadow-2xl shadow-accent/70 p-1 md:p-2 bg-secondary/80 backdrop-blur-sm">
                                <img src="https://placehold.co/1200x650/16213e/a382ff?text=Syncboard+Interface" alt="SyncBoard whiteboard preview" className="rounded-xl w-full h-auto object-cover border border-accent/50"/>
                                <div className="absolute inset-0 rounded-xl ring-4 ring-accent/50 pointer-events-none animate-ping-slow opacity-50"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="py-24 md:py-32 bg-secondary">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 ref={refForAnimation} className="slide-up text-4xl font-extrabold text-highlight mb-4">The Tools You Need to Visualize Everything</h2>
                            <p ref={refForAnimation} className="slide-up text-xl text-subtle max-w-3xl mx-auto" style={{ transitionDelay: '200ms' }}>
                                Stop using outdated apps. SyncBoard provides powerful, modern tools built for team synergy.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {features.map(({ Icon, title, desc }, index) => (
                                <div key={index} ref={refForAnimation} className="slide-up p-8 bg-primary/70 rounded-2xl border border-accent/50 shadow-xl shadow-accent-dark/20 hover:bg-secondary transition duration-300 group" style={{ transitionDelay: `${100 * (index + 1)}ms` }}>
                                    <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-accent-dark group-hover:bg-accent transition">
                                        <Icon />
                                    </div>
                                    <h3 className="text-2xl font-bold text-highlight mb-3">{title}</h3>
                                    <p className="text-subtle">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer id="contact" className="bg-primary border-t border-accent-dark/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div className="mb-4 md:mb-0">
                            <p className="text-lg font-bold tracking-tight text-accent">
                                <span className="text-highlight">Sync</span>Board
                            </p>
                            <p className="text-sm text-subtle/70 mt-1">© 2025 SyncBoard Inc. All rights reserved.</p>
                        </div>
                        <div className="space-x-6 text-subtle text-sm">
                            <a href="/terms" className="hover:text-accent transition">Terms of Service</a>
                            <a href="/privacy" className="hover:text-accent transition">Privacy Policy</a>
                            <a href="/support" className="hover:text-accent transition">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;