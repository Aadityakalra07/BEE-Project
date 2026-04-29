import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── DATA ── */
const features = [
  { icon: '🛡️', title: 'Verified Profiles', desc: 'Every profile is manually verified by our admin team for authenticity and safety.' },
  { icon: '🔍', title: 'Advanced Search', desc: 'Filter by age, religion, city, profession and more to find your ideal match.' },
  { icon: '💌', title: 'Send Interests', desc: 'Express interest and connect directly with compatible profiles in seconds.' },
  { icon: '🔒', title: 'Safe & Secure', desc: 'Your data is fully encrypted with robust privacy measures at every level.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Access TrueMatch beautifully from any device — desktop, tablet, or mobile.' },
  { icon: '🌍', title: 'All Communities', desc: 'Open to all religions, castes, cities and professions across India.' },
];

const steps = [
  { num: '01', title: 'Create Profile', desc: 'Register and fill in your details, photos, and partner preferences.' },
  { num: '02', title: 'Get Verified', desc: 'Our admin team reviews your profile for authenticity and approves it.' },
  { num: '03', title: 'Browse & Connect', desc: 'Search profiles, send interests, and start meaningful conversations.' },
  { num: '04', title: 'Find Your Match', desc: 'Meet your perfect life partner and begin your beautiful journey.' },
];

const testimonials = [
  { name: 'Priya & Arjun', city: 'Mumbai', text: 'We found each other on TrueMatch within weeks. The verified profiles gave us confidence to connect openly.' },
  { name: 'Sneha & Rahul', city: 'Delhi', text: 'The search filters made it so easy to find someone who matched our family values. Happily married now!' },
  { name: 'Ananya & Vikram', city: 'Bangalore', text: "TrueMatch's safe environment let us take our time and truly get to know each other before meeting." },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Verified Profiles' },
  { value: 5000, suffix: '+', label: 'Successful Matches' },
  { value: 50, suffix: '+', label: 'Cities Covered' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate' },
];

const trustBadges = [
  { icon: '🔐', label: 'SSL Secured' },
  { icon: '🛡️', label: 'Privacy First' },
  { icon: '✅', label: 'Manually Verified' },
  { icon: '⭐', label: 'Premium Quality' },
];

const typewriterWords = ['Soulmate', 'Life Partner', 'Best Friend', 'Forever Love'];

/* ── COUNTER HOOK ── */
const useCountUp = (target, duration = 2000, startCounting) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, startCounting]);
  return count;
};

const CounterCard = ({ value, suffix, label, startCounting }) => {
  const count = useCountUp(value, 2000, startCounting);
  return (
    <div className="text-center">
      <p className="text-4xl sm:text-5xl font-display font-bold bg-gradient-to-r from-brand-500 to-gold-400 bg-clip-text text-transparent">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">{label}</p>
    </div>
  );
};

/* ── COMPONENT ── */
const Home = () => {
  const { user } = useAuth();
  const wrapperRef = useRef(null);
  const heroRef = useRef(null);
  const orbsRef = useRef(null);
  const heroTagRef = useRef(null);
  const heroH1Ref = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnsRef = useRef(null);
  const marqueeRef = useRef(null);
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
  const statsRef = useRef(null);

  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const word = typewriterWords[typewriterIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypewriterText(word.substring(0, typewriterText.length + 1));
        if (typewriterText === word) setTimeout(() => setIsDeleting(true), 1500);
      } else {
        setTypewriterText(word.substring(0, typewriterText.length - 1));
        if (typewriterText === '') {
          setIsDeleting(false);
          setTypewriterIndex((prev) => (prev + 1) % typewriterWords.length);
        }
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, typewriterIndex]);

  // Floating CTA on scroll
  useEffect(() => {
    const handleScroll = () => setShowFloatingCTA(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stats counter trigger
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // GSAP animations
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1px)', () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        if (orbsRef.current) {
          tl.fromTo(orbsRef.current.children, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, stagger: 0.2 }, 0);
        }
        tl.fromTo(heroTagRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.3)
          .fromTo(heroH1Ref.current, { y: 80, opacity: 0, clipPath: 'inset(100% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.2 }, 0.4)
          .fromTo(heroSubRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.7)
          .fromTo(heroBtnsRef.current?.children ?? [], { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.7 }, 0.9);

        if (orbsRef.current) {
          [...orbsRef.current.children].forEach((orb, i) => {
            gsap.to(orb, { y: `random(-25, 25)`, x: `random(-15, 15)`, duration: 4 + i * 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.4 });
          });
        }

        gsap.to(heroH1Ref.current, { y: -80, scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } });

        if (marqueeRef.current) {
          const inner = marqueeRef.current.querySelector('.marquee-inner');
          if (inner) gsap.to(inner, { xPercent: -50, repeat: -1, duration: 30, ease: 'none' });
        }

        if (bigTextRef.current) {
          gsap.fromTo(bigTextRef.current, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, scrollTrigger: { trigger: bigTextRef.current, start: 'top 90%', end: 'top 40%', scrub: 1 } });
        }

        gsap.fromTo(featHeaderRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, scrollTrigger: { trigger: featHeaderRef.current, start: 'top 85%' } });
        featCards.current.forEach((el, i) => {
          if (!el) return;
          gsap.fromTo(el, { y: 80, opacity: 0, rotateY: 8 }, { y: 0, opacity: 1, rotateY: 0, duration: 0.8, delay: i * 0.08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
        });

        gsap.fromTo(stepsHeaderRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, scrollTrigger: { trigger: stepsHeaderRef.current, start: 'top 85%' } });
        if (timelineBarRef.current) {
          gsap.fromTo(timelineBarRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut', scrollTrigger: { trigger: stepsWrapRef.current, start: 'top 75%' } });
        }
        stepEls.current.forEach((el, i) => {
          if (!el) return;
          gsap.fromTo(el, { y: 70, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, delay: 0.3 + i * 0.15, ease: 'back.out(1.4)', scrollTrigger: { trigger: stepsWrapRef.current, start: 'top 75%' } });
        });

        gsap.fromTo(testiHeaderRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, scrollTrigger: { trigger: testiHeaderRef.current, start: 'top 85%' } });
        testiCards.current.forEach((el, i) => {
          if (!el) return;
          gsap.fromTo(el, { x: i === 0 ? -80 : i === 2 ? 80 : 0, y: 40, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.9, delay: i * 0.12, ease: 'power3.out', scrollTrigger: { trigger: testiRef.current, start: 'top 80%' } });
        });

        if (ctaRef.current) {
          gsap.fromTo(ctaRef.current, { y: 80, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' } });
        }
      }, wrapperRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  const marqueeWords = ['Love', 'Trust', 'Family', 'Together', 'Forever', 'Happiness', 'Bond', 'Soulmate', 'Destiny', 'Joy'];

  return (
    <div ref={wrapperRef} className="bg-white dark:bg-dark-bg overflow-hidden">

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        <div ref={orbsRef} className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[8%] w-72 h-72 rounded-full bg-gradient-to-br from-brand-500/30 to-brand-700/20 blur-3xl" />
          <div className="absolute top-[20%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-500/10 blur-3xl" />
          <div className="absolute bottom-[15%] left-[25%] w-80 h-80 rounded-full bg-gradient-to-br from-white/5 to-brand-300/10 blur-3xl" />
          <div className="absolute bottom-[5%] right-[20%] w-64 h-64 rounded-full bg-gradient-to-tr from-gold-300/15 to-transparent blur-2xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span ref={heroTagRef} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold tracking-wider uppercase px-5 py-2 rounded-full mb-8 border border-white/10 opacity-0">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            India's Most Trusted Matrimony
          </span>

          <h1 ref={heroH1Ref} className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold text-white leading-[0.95] tracking-tight mb-8 opacity-0">
            Find Your
            <br />
            <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-brand-300 bg-clip-text text-transparent">
              {typewriterText}
            </span>
            <span className="animate-pulse text-gold-400">|</span>
          </h1>

          <p ref={heroSubRef} className="max-w-lg mx-auto text-base sm:text-lg text-white/60 leading-relaxed mb-12 opacity-0">
            TrueMatch connects you with compatible partners through verified profiles,
            intelligent matching, and a safe community built on trust.
          </p>

          <div ref={heroBtnsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard" className="btn-gold text-base">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/register" className="btn-gold text-base">Get Started Free →</Link>
                <Link to="/login" className="px-9 py-4 border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all duration-300 opacity-0">Sign In</Link>
              </>
            )}
          </div>
        </div>

        <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C320,120 640,0 960,60 C1120,90 1280,30 1440,60 L1440,120 L0,120 Z" className="fill-surface-100 dark:fill-dark-bg" />
        </svg>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div ref={marqueeRef} className="bg-surface-100 dark:bg-dark-bg py-5 overflow-hidden border-b border-brand-100/30 dark:border-dark-border/30">
        <div className="marquee-inner flex whitespace-nowrap w-max">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="text-sm font-semibold text-brand-300/30 dark:text-brand-700/30 uppercase tracking-[0.3em] mx-8 select-none">
              {word} <span className="text-gold-400/50 mx-4">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ STATS COUNTER ═══ */}
      <section ref={statsRef} className="bg-surface-100 dark:bg-dark-bg py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <CounterCard key={s.label} {...s} startCounting={statsVisible} />
          ))}
        </div>
      </section>

      {/* ═══ BIG REVEAL TEXT ═══ */}
      <section className="bg-white dark:bg-dark-surface py-24 lg:py-32 overflow-hidden">
        <div ref={bigTextRef} className="max-w-5xl mx-auto px-4 text-center opacity-0">
          <p className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white leading-tight">
            Every love story is{' '}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">beautiful</span>,
            <br className="hidden sm:block" /> but yours deserves to be{' '}
            <span className="bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">extraordinary</span>.
          </p>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="bg-surface-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div ref={featHeaderRef} className="text-center mb-16 opacity-0">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-3">Why TrueMatch</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white">Designed for Meaningful Connections</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-base">
              Everything you need to find the right partner in a safe, trusted environment.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }, i) => (
              <div key={title} ref={(el) => (featCards.current[i] = el)}
                className="gradient-border-card group opacity-0" style={{ perspective: '1000px' }}>
                <div className="bg-white dark:bg-dark-card rounded-3xl p-8 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center text-xl mb-4 shadow-glow">
                    {icon}
                  </div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST BADGES ═══ */}
      <section className="bg-white dark:bg-dark-surface py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 py-4">
              <span className="text-3xl">{icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={stepsWrapRef} className="bg-surface-100 dark:bg-dark-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div ref={stepsHeaderRef} className="text-center mb-20 opacity-0">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-3">Your Journey</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto">Four simple steps to begin your journey towards a beautiful partnership.</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-[12.5%] w-[75%] h-[3px] bg-brand-100/50 dark:bg-dark-border rounded-full overflow-hidden">
              <div ref={timelineBarRef} className="h-full bg-gradient-to-r from-brand-500 via-gold-400 to-brand-500 origin-left" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {steps.map(({ num, title, desc }, i) => (
                <div key={num} ref={(el) => (stepEls.current[i] = el)} className="relative text-center opacity-0">
                  <div className="relative z-10 w-24 h-24 mx-auto bg-white dark:bg-dark-card border-[3px] border-brand-500 rounded-full flex flex-col items-center justify-center shadow-glow mb-6">
                    <span className="text-2xl font-display font-bold bg-gradient-to-r from-brand-500 to-gold-400 bg-clip-text text-transparent">{num}</span>
                  </div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section ref={testiRef} className="bg-surface-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div ref={testiHeaderRef} className="text-center mb-16 opacity-0">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-3">Love Stories</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white">Real Matches, Real Happiness</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials.map(({ name, city, text }, i) => (
              <div key={name} ref={(el) => (testiCards.current[i] = el)}
                className="gradient-border-card opacity-0">
                <div className="bg-white dark:bg-dark-card rounded-3xl p-8 h-full">
                  <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed mb-7 italic">&ldquo;{text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm">{name.charAt(0)}</div>
                    <div>
                      <p className="font-display font-bold text-gray-900 dark:text-white text-sm">{name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{city}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      {!user && (
        <section ref={ctaRef} className="bg-white dark:bg-dark-bg px-4 sm:px-6 lg:px-8 py-16 opacity-0">
          <div className="max-w-5xl mx-auto bg-gradient-hero rounded-[2rem] p-12 sm:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-500/10 blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-gold-400/10 blur-2xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-5 leading-tight">
                Ready to Write Your<br />Love Story?
              </h2>
              <p className="text-white/60 mb-10 max-w-md mx-auto text-base">Create your free profile today. Your soulmate might be just one click away.</p>
              <Link to="/register" className="btn-gold text-base">Get Started — It's Free</Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ FLOATING CTA ═══ */}
      {!user && showFloatingCTA && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <Link to="/register" className="btn-gold shadow-2xl !px-6 !py-3 flex items-center gap-2 text-sm">
            ✨ Register Free
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
