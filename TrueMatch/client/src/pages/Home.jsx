import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────── DATA ──────────────── */
const features = [
  { icon: '🔒', title: 'Verified Profiles', desc: 'Every profile is manually verified by our admin team for authenticity and safety.' },
  { icon: '🔍', title: 'Advanced Search', desc: 'Filter by age, religion, city, profession and more to find your ideal match.' },
  { icon: '💑', title: 'Send Interests', desc: 'Express interest and connect directly with compatible profiles in seconds.' },
  { icon: '🛡️', title: 'Safe & Secure', desc: 'Your data is fully encrypted with robust privacy measures at every level.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Access TrueMatch beautifully from any device — desktop, tablet, or mobile.' },
  { icon: '❤️', title: 'All Communities', desc: 'Open to all religions, castes, cities and professions across India.' },
];

const stats = [
  { value: '50K+', label: 'Registered Members' },
  { value: '12K+', label: 'Successful Matches' },
  { value: '98%', label: 'Verified Profiles' },
  { value: '150+', label: 'Cities Covered' },
];

const steps = [
  { num: '01', title: 'Create Profile', desc: 'Register and fill in your details, photos, and partner preferences.', icon: '✍️' },
  { num: '02', title: 'Get Verified', desc: 'Our admin team reviews your profile for authenticity and approves it.', icon: '✅' },
  { num: '03', title: 'Browse & Connect', desc: 'Search profiles, send interests, and start meaningful conversations.', icon: '🔗' },
  { num: '04', title: 'Find Your Match', desc: 'Meet your perfect life partner and begin your beautiful journey.', icon: '💍' },
];

const testimonials = [
  { name: 'Priya & Arjun', city: 'Mumbai', text: 'We found each other on TrueMatch within weeks. The verified profiles gave us confidence to connect openly.', emoji: '💕' },
  { name: 'Sneha & Rahul', city: 'Delhi', text: 'The search filters made it so easy to find someone who matched our family values. Happily married now!', emoji: '🥰' },
  { name: 'Ananya & Vikram', city: 'Bangalore', text: "TrueMatch's safe environment let us take our time and truly get to know each other before meeting.", emoji: '✨' },
];

/* ──────────────── COMPONENT ──────────────── */
const Home = () => {
  const { user } = useAuth();
  const wrapperRef = useRef(null);

  // Section refs
  const heroRef = useRef(null);
  const orbsRef = useRef(null);
  const heroTagRef = useRef(null);
  const heroH1Ref = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnsRef = useRef(null);

  const marqueeRef = useRef(null);

  const statsRef = useRef(null);
  const statEls = useRef([]);

  const bigTextRef = useRef(null);

  const featHeaderRef = useRef(null);
  const featCards = useRef([]);

  const stepsWrapRef = useRef(null);
  const stepsHeaderRef = useRef(null);
  const stepEls = useRef([]);
  const timelineBarRef = useRef(null);

  const testiRef = useRef(null);
  const testiHeaderRef = useRef(null);
  const testiCards = useRef([]);

  const ctaRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1px)', () => {
      const ctx = gsap.context(() => {
        /* ═══════════════════════════════════════
           1. HERO — cinematic entrance
        ═══════════════════════════════════════ */
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        // Orbs scale-in
        if (orbsRef.current) {
          tl.fromTo(
            orbsRef.current.children,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.6, stagger: 0.2 },
            0
          );
        }

        tl.fromTo(heroTagRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.3)
          .fromTo(heroH1Ref.current, { y: 80, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
            { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.2 }, 0.4)
          .fromTo(heroSubRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.7)
          .fromTo(heroBtnsRef.current?.children ?? [], { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.12, duration: 0.7 }, 0.9);

        // Floating orbs ambient motion
        if (orbsRef.current) {
          [...orbsRef.current.children].forEach((orb, i) => {
            gsap.to(orb, {
              y: `random(-25, 25)`,
              x: `random(-15, 15)`,
              duration: 4 + i * 0.8,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: i * 0.4,
            });
          });
        }

        // Hero parallax on scroll
        gsap.to(heroH1Ref.current, {
          y: -80,
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
        gsap.to(heroSubRef.current, {
          y: -40,
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
        });

        /* ═══════════════════════════════════════
           2. MARQUEE — infinite horizontal scroll
        ═══════════════════════════════════════ */
        if (marqueeRef.current) {
          const inner = marqueeRef.current.querySelector('.marquee-inner');
          if (inner) {
            gsap.to(inner, {
              xPercent: -50,
              repeat: -1,
              duration: 30,
              ease: 'none',
            });
          }
        }

        /* ═══════════════════════════════════════
           3. STATS — counter roll-up with stagger
        ═══════════════════════════════════════ */
        statEls.current.forEach((el, i) => {
          if (!el) return;
          gsap.fromTo(el,
            { y: 60, opacity: 0, scale: 0.9 },
            {
              y: 0, opacity: 1, scale: 1,
              duration: 0.8,
              delay: i * 0.1,
              ease: 'back.out(1.6)',
              scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
            }
          );
        });

        /* ═══════════════════════════════════════
           4. BIG REVEAL TEXT — scale + fade on scroll (MS Design hero text style)
        ═══════════════════════════════════════ */
        if (bigTextRef.current) {
          gsap.fromTo(bigTextRef.current,
            { scale: 0.7, opacity: 0 },
            {
              scale: 1, opacity: 1,
              scrollTrigger: {
                trigger: bigTextRef.current,
                start: 'top 90%',
                end: 'top 40%',
                scrub: 1,
              },
            }
          );
        }

        /* ═══════════════════════════════════════
           5. FEATURES — header + staggered card reveal
        ═══════════════════════════════════════ */
        gsap.fromTo(featHeaderRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9,
            scrollTrigger: { trigger: featHeaderRef.current, start: 'top 85%' },
          }
        );

        featCards.current.forEach((el, i) => {
          if (!el) return;
          gsap.fromTo(el,
            { y: 80, opacity: 0, rotateY: 8 },
            {
              y: 0, opacity: 1, rotateY: 0,
              duration: 0.8,
              delay: i * 0.08,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%' },
            }
          );
        });

        /* ═══════════════════════════════════════
           6. HOW IT WORKS — timeline bar draw + step cards
        ═══════════════════════════════════════ */
        gsap.fromTo(stepsHeaderRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9,
            scrollTrigger: { trigger: stepsHeaderRef.current, start: 'top 85%' },
          }
        );

        // Draw the timeline bar
        if (timelineBarRef.current) {
          gsap.fromTo(timelineBarRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: 'power2.inOut',
              scrollTrigger: { trigger: stepsWrapRef.current, start: 'top 75%' },
            }
          );
        }

        stepEls.current.forEach((el, i) => {
          if (!el) return;
          gsap.fromTo(el,
            { y: 70, opacity: 0, scale: 0.85 },
            {
              y: 0, opacity: 1, scale: 1,
              duration: 0.7,
              delay: 0.3 + i * 0.15,
              ease: 'back.out(1.4)',
              scrollTrigger: { trigger: stepsWrapRef.current, start: 'top 75%' },
            }
          );
        });

        /* ═══════════════════════════════════════
           7. TESTIMONIALS — cards slide in from sides
        ═══════════════════════════════════════ */
        gsap.fromTo(testiHeaderRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9,
            scrollTrigger: { trigger: testiHeaderRef.current, start: 'top 85%' },
          }
        );

        testiCards.current.forEach((el, i) => {
          if (!el) return;
          const fromX = i === 0 ? -80 : i === 2 ? 80 : 0;
          gsap.fromTo(el,
            { x: fromX, y: 40, opacity: 0 },
            {
              x: 0, y: 0, opacity: 1,
              duration: 0.9,
              delay: i * 0.12,
              ease: 'power3.out',
              scrollTrigger: { trigger: testiRef.current, start: 'top 80%' },
            }
          );
        });

        /* ═══════════════════════════════════════
           8. CTA — scale-up reveal
        ═══════════════════════════════════════ */
        if (ctaRef.current) {
          gsap.fromTo(ctaRef.current,
            { y: 80, opacity: 0, scale: 0.92 },
            {
              y: 0, opacity: 1, scale: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' },
            }
          );
        }
      }, wrapperRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  /* ────────────── MARQUEE WORDS ────────────── */
  const marqueeWords = ['Love', 'Trust', 'Family', 'Together', 'Forever', 'Happiness', 'Bond', 'Soulmate', 'Destiny', 'Joy'];

  return (
    <div ref={wrapperRef} className="bg-white overflow-hidden">

      {/* ════════════════════════════════════════
          HERO — Full-viewport, floating orbs (MS Design style)
      ════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      >
        {/* Floating gradient orbs (like MS Design glowing spheres) */}
        <div ref={orbsRef} className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[8%] w-72 h-72 rounded-full bg-gradient-to-br from-brand-400/40 to-brand-600/20 blur-3xl" />
          <div className="absolute top-[20%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-accent-light/30 to-accent/20 blur-3xl" />
          <div className="absolute bottom-[15%] left-[25%] w-80 h-80 rounded-full bg-gradient-to-br from-white/10 to-brand-300/15 blur-3xl" />
          <div className="absolute bottom-[5%] right-[20%] w-64 h-64 rounded-full bg-gradient-to-tr from-accent-light/25 to-transparent blur-2xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            ref={heroTagRef}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold tracking-wider uppercase px-5 py-2 rounded-full mb-8 border border-white/10 opacity-0"
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            India's Most Trusted Matrimony
          </span>

          <h1
            ref={heroH1Ref}
            className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-white leading-[0.95] tracking-tight mb-8 opacity-0"
          >
            Where Hearts
            <br />
            <span className="bg-gradient-to-r from-brand-300 via-brand-200 to-white bg-clip-text text-transparent">
              Find Home
            </span>
          </h1>

          <p
            ref={heroSubRef}
            className="max-w-lg mx-auto text-base sm:text-lg text-white/70 leading-relaxed mb-12 opacity-0"
          >
            TrueMatch connects you with compatible partners through verified profiles,
            intelligent matching, and a safe community built on trust.
          </p>

          <div ref={heroBtnsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard" className="group relative px-9 py-4 bg-white text-accent-dark font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <span className="relative z-10">Go to Dashboard →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-100 to-accent-light/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="group relative px-9 py-4 bg-white text-accent-dark font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden opacity-0">
                  <span className="relative z-10">Register Free →</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-100 to-accent-light/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link to="/login" className="px-9 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 opacity-0">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom curve (MS Design smooth wave) */}
        <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C320,120 640,0 960,60 C1120,90 1280,30 1440,60 L1440,120 L0,120 Z" fill="#fafaf9" />
        </svg>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE — Infinite scroll text strip (MS Design ribbon)
      ════════════════════════════════════════ */}
      <div ref={marqueeRef} className="bg-cream py-5 overflow-hidden border-b border-gray-100/60">
        <div className="marquee-inner flex whitespace-nowrap w-max">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="text-sm font-semibold text-accent/30 uppercase tracking-[0.3em] mx-8 select-none">
              {word} <span className="text-brand-300 mx-4">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          STATS — Glassmorphism cards
      ════════════════════════════════════════ */}
      <section ref={statsRef} className="bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map(({ value, label }, i) => (
              <div
                key={label}
                ref={(el) => (statEls.current[i] = el)}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100/80 hover:border-brand-200 hover:shadow-lg transition-all duration-300 opacity-0"
              >
                <p className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-br from-brand-500 to-brand-700 bg-clip-text text-transparent">
                  {value}
                </p>
                <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BIG REVEAL TEXT — Scroll-driven scale (MS Design statement)
      ════════════════════════════════════════ */}
      <section className="bg-white py-24 lg:py-32 overflow-hidden">
        <div ref={bigTextRef} className="max-w-5xl mx-auto px-4 text-center opacity-0">
          <p className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-accent-dark leading-tight">
            Every love story is{' '}
            <span className="bg-gradient-to-r from-brand-500 to-brand-400 bg-clip-text text-transparent">beautiful</span>,
            <br className="hidden sm:block" /> but yours deserves to be{' '}
            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">extraordinary</span>.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES — Card grid with 3D hover (MS Design article cards)
      ════════════════════════════════════════ */}
      <section className="bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div ref={featHeaderRef} className="text-center mb-16 opacity-0">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-3">Why TrueMatch</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-accent-dark">Designed for Meaningful Connections</h2>
            <p className="mt-4 text-gray-500 max-w-lg mx-auto text-base">
              Everything you need to find the right partner in a safe, trusted environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                ref={(el) => (featCards.current[i] = el)}
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-brand-200 transition-all duration-500 opacity-0 overflow-hidden"
                style={{ perspective: '1000px' }}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50/0 to-brand-50/0 group-hover:from-brand-50/50 group-hover:to-accent-light/10 transition-all duration-500 rounded-3xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    {icon}
                  </div>
                  <h3 className="font-bold text-accent-dark text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS — Timeline with animated bar
      ════════════════════════════════════════ */}
      <section ref={stepsWrapRef} className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div ref={stepsHeaderRef} className="text-center mb-20 opacity-0">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-3">Your Journey</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-accent-dark">How It Works</h2>
            <p className="mt-4 text-gray-500 max-w-md mx-auto">
              Four simple steps to begin your journey towards a beautiful partnership.
            </p>
          </div>

          {/* Timeline bar */}
          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-[12.5%] w-[75%] h-[3px] bg-gray-100 rounded-full overflow-hidden">
              <div ref={timelineBarRef} className="h-full bg-gradient-to-r from-brand-500 via-accent to-brand-400 origin-left" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {steps.map(({ num, title, desc, icon }, i) => (
                <div
                  key={num}
                  ref={(el) => (stepEls.current[i] = el)}
                  className="relative text-center opacity-0"
                >
                  <div className="relative z-10 w-24 h-24 mx-auto bg-white border-[3px] border-brand-500 rounded-full flex flex-col items-center justify-center shadow-lg mb-6 group">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-[10px] font-extrabold text-brand-500 mt-0.5">{num}</span>
                  </div>
                  <h3 className="font-bold text-accent-dark text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS — Cards slide from sides (MS Design profiles)
      ════════════════════════════════════════ */}
      <section ref={testiRef} className="bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div ref={testiHeaderRef} className="text-center mb-16 opacity-0">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-3">Love Stories</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-accent-dark">Real Matches, Real Happiness</h2>
            <p className="mt-4 text-gray-500 max-w-md mx-auto">
              Couples who found their perfect match through TrueMatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials.map(({ name, city, text, emoji }, i) => (
              <div
                key={name}
                ref={(el) => (testiCards.current[i] = el)}
                className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-brand-200 hover:shadow-xl transition-all duration-500 opacity-0"
              >
                <div className="text-4xl mb-5">{emoji}</div>
                <p className="text-gray-600 text-[15px] leading-relaxed mb-7 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-accent flex items-center justify-center text-white font-bold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-accent-dark text-sm">{name}</p>
                    <p className="text-xs text-gray-400">{city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA — Big statement with gradient (MS Design resource cards)
      ════════════════════════════════════════ */}
      {!user && (
        <section ref={ctaRef} className="bg-white px-4 sm:px-6 lg:px-8 py-16 opacity-0">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-12 sm:p-16 text-center text-white relative overflow-hidden">
            {/* Decorative orbs inside CTA */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-400/10 blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5 leading-tight">
                Ready to Write Your<br />Love Story?
              </h2>
              <p className="text-white/70 mb-10 max-w-md mx-auto text-base">
                Create your free profile today. Your soulmate might be just one click away.
              </p>
              <Link
                to="/register"
                className="inline-block px-10 py-4 bg-white text-accent-dark font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
              >
                Get Started — It's Free
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
