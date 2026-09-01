import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ChevronDown, Instagram, Menu, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const images = {
  couple: '/images/image.png',
  editorial: '/images/image copy.png',
  bow: '/images/image copy 2.png',
  celebration: '/images/image copy 3.png',
};

const experiences = [
  { title: 'Private escapes', copy: 'Time on the water, away from the ordinary.', image: images.bow },
  { title: 'Celebrations', copy: 'Create a setting worth remembering.', image: images.celebration },
  { title: 'Couple experiences', copy: 'Slow moments, open water and unforgettable views.', image: images.couple },
  { title: 'Yacht shoots', copy: 'An unforgettable setting for your next visual story.', image: images.editorial },
];

const highlights = ['Romantic escapes', 'Private moments', 'Photoshoots', 'Celebrations', 'Sunset experiences', 'Custom experiences'];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const headerRef = useRef<HTMLElement>(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('is-scrolled', window.scrollY > 60);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const enquiry = {
      name: String(form.get('name') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      preferred_date: String(form.get('date') ?? '').trim() || null,
      guests: String(form.get('guests') ?? '').trim() || null,
      occasion: String(form.get('occasion') ?? '').trim() || null,
      message: String(form.get('message') ?? '').trim() || null,
    };

    if (!isSupabaseConfigured || !supabase) {
      setSubmitting(false);
      setError('Enquiry is temporarily unavailable. Please try again later.');
      return;
    }

    const { error: submitError } = await supabase.from('meridian_enquiries').insert(enquiry);
    setSubmitting(false);
    if (submitError) {
      setError('We could not send your enquiry right now. Please try again.');
      return;
    }
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <div className="site-shell">
      <header className="site-header" ref={headerRef}>
        <a className="brand-mark" href="#top" onClick={closeMenu} aria-label="Meridian Yachts home">
          <span>MERIDIAN</span>
          <small>YACHTS <i>BY NEXOGO</i></small>
        </a>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#gallery" onClick={closeMenu}>Gallery</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a className="nav-enquire" href="#enquire" onClick={closeMenu}>Enquire <ArrowUpRight size={14} /></a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-image" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow">Luxury yacht experiences · Goa, India</p>
            <h1>Goa, from a<br /><em>different</em> perspective.</h1>
            <p className="hero-copy">Luxury yacht experiences designed for unforgettable moments on the water.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#enquire">Book your experience <ArrowUpRight size={16} /></a>
              <a className="text-link" href="#experience">Explore Meridian <ArrowDown size={15} /></a>
            </div>
          </div>
          <a className="scroll-cue" href="#introduction"><span>Scroll to explore</span><ArrowDown size={16} /></a>
          <span className="hero-index">01 / 05</span>
        </section>

        <section className="intro section-grid" id="introduction">
          <div className="intro-copy reveal">
            <p className="eyebrow">The art of the escape</p>
            <h2>Your escape<br /><em>starts at sea.</em></h2>
            <p className="body-copy">Meridian Yachts brings a more intimate way to experience Goa. Step aboard, leave the shore behind, and make the water part of the story.</p>
            <a className="arrow-link" href="#about">Discover the Meridian way <ArrowUpRight size={16} /></a>
          </div>
          <div className="intro-image image-frame"><img src={images.bow} alt="The bow of a yacht over clear blue water" /></div>
        </section>

        <section className="experience-section" id="experience">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">Your time, your way</p><h2>The Meridian<br /><em>experience.</em></h2></div>
            <p className="heading-note">A private setting for the moments that deserve more space, more sky, and a little less noise.</p>
          </div>
          <div className="experience-grid">
            {experiences.map((experience, index) => (
              <article className="experience-card" key={experience.title}>
                <div className="card-image image-frame"><img src={experience.image} alt={experience.title} /></div>
                <div className="card-meta"><span>0{index + 1}</span><span>Meridian</span></div>
                <h3>{experience.title}</h3><p>{experience.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="section-heading gallery-heading"><p className="eyebrow">A visual journal</p><h2>On the<br /><em>water.</em></h2><p className="heading-note">Some experiences are better remembered than explained.</p></div>
          <div className="gallery-grid">
            <button className="gallery-item gallery-large" onClick={() => setLightboxImage(images.couple)}><img src={images.couple} alt="Couple enjoying a quiet moment on a yacht" /><span>01 · Open water</span></button>
            <button className="gallery-item gallery-small" onClick={() => setLightboxImage(images.editorial)}><img src={images.editorial} alt="Editorial black and white yacht scene" /><span>02 · Editorial</span></button>
            <button className="gallery-item gallery-wide" onClick={() => setLightboxImage(images.celebration)}><img src={images.celebration} alt="Celebration on a yacht deck" /><span>03 · Celebration</span></button>
            <button className="gallery-item gallery-tall" onClick={() => setLightboxImage(images.bow)}><img src={images.bow} alt="People relaxing on the bow of a yacht" /><span>04 · The quiet between</span></button>
          </div>
        </section>

        <section className="life-section full-bleed-image">
          <div className="life-image" />
          <div className="life-overlay" />
          <div className="life-content"><p className="eyebrow">Goa, at its most beautiful</p><h2>Life like<br /><em>this.</em></h2><p>Some experiences are better remembered than explained.</p><a className="button button-light" href="#enquire">Plan your experience <ArrowUpRight size={16} /></a></div>
        </section>

        <section className="goa-section section-grid">
          <div className="goa-image image-frame"><img src={images.editorial} alt="Yacht moving across open water" /></div>
          <div className="goa-copy"><p className="eyebrow">A different kind of Goa</p><h2>Goa, from<br /><em>the water.</em></h2><p className="body-copy">Trade the usual Goa itinerary for open water, changing horizons and a completely different way to experience the coast.</p><a className="arrow-link" href="#enquire">Enquire now <ArrowUpRight size={16} /></a></div>
        </section>

        <section className="highlights-section">
          <div className="section-heading"><p className="eyebrow">Make it yours</p><h2>Moments made<br /><em>to linger.</em></h2></div>
          <div className="highlights-grid">{highlights.map((highlight, index) => <div className="highlight" key={highlight}><span>0{index + 1}</span><h3>{highlight}</h3><ArrowUpRight size={17} /></div>)}</div>
        </section>

        <section className="about-section" id="about">
          <div className="about-label"><span className="vertical-word">MERIDIAN YACHTS</span></div>
          <div className="about-copy"><p className="eyebrow">The brand</p><h2>The Meridian<br /><em>way.</em></h2><p className="body-copy">Meridian Yachts by NexoGo is about luxury, privacy and personal time on the water. A more considered way to experience Goa, shaped around the moments you want to remember.</p><a className="arrow-link" href="#enquire">Start a conversation <ArrowUpRight size={16} /></a></div>
          <div className="about-image image-frame"><img src={images.celebration} alt="A couple celebrating on a yacht" /></div>
        </section>

        <section className="enquire-section" id="enquire">
          <div className="enquire-intro"><p className="eyebrow">Begin here</p><h2>Ready to leave<br /><em>the shore?</em></h2><p>Tell us a little about the experience you have in mind. Meridian Yachts will get in touch with you shortly.</p></div>
          <div className="form-wrap">
            {submitted ? <div className="success-message"><span className="success-mark">✓</span><h3>Thank you.</h3><p>Your enquiry has been received. Meridian Yachts will get in touch with you shortly.</p><a className="arrow-link" href="#top">Return to the beginning <ArrowUpRight size={16} /></a></div> : <form onSubmit={handleSubmit}><div className="form-row"><label>Name<input name="name" required placeholder="Your name" /></label><label>Phone number<input name="phone" required type="tel" placeholder="Your phone number" /></label></div><div className="form-row"><label>Email<input name="email" required type="email" placeholder="you@example.com" /></label><label>Preferred date<input name="date" type="date" /></label></div><div className="form-row"><label>Number of guests<input name="guests" placeholder="How many guests?" /></label><label>Experience / occasion<input name="occasion" placeholder="Tell us what you are imagining" /></label></div><label>Message<textarea name="message" rows={4} placeholder="A little more about your plans" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-gold" type="submit" disabled={submitting}>{submitting ? 'Sending enquiry…' : 'Request an experience'} <ArrowUpRight size={16} /></button></form>}
          </div>
        </section>

        <section className="faq-section"><div className="section-heading"><p className="eyebrow">Good to know</p><h2>Questions, before<br /><em>you set sail.</em></h2></div><div className="faq-list">{['What experiences can I book?', 'Where does Meridian Yachts operate?', 'How do I enquire?', 'Can I plan a private experience?', 'Can I enquire for a photoshoot or celebration?'].map((question) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>Contact Meridian Yachts for current availability and details.</p></details>)}</div></section>

        <section className="final-cta full-bleed-image"><div className="final-image" /><div className="final-overlay" /><div className="final-content"><p className="eyebrow">A little further from shore</p><h2>Your next story<br /><em>starts on the water.</em></h2><div className="hero-actions"><a className="button button-light" href="#enquire">Enquire now <ArrowUpRight size={16} /></a><a className="text-link" href="#experience">View experiences <ArrowUpRight size={15} /></a></div></div></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><a className="brand-mark" href="#top"><span>MERIDIAN</span><small>YACHTS <i>BY NEXOGO</i></small></a><p>Luxury yacht experiences<br />Operating across Goa</p></div><div className="footer-links"><div><span className="footer-label">Navigate</span><a href="#top">Home</a><a href="#experience">Experience</a><a href="#gallery">Gallery</a><a href="#about">About</a><a href="#enquire">Enquire</a></div><div><span className="footer-label">Follow along</span><a href="https://www.instagram.com/meridian.yachts/" target="_blank" rel="noreferrer"><Instagram size={15} /> @meridian.yachts</a></div></div><div className="footer-bottom"><span>Meridian Yachts by NexoGo.</span><span>Goa, India · {new Date().getFullYear()}</span></div></footer>

      <a className="mobile-cta" href="#enquire" onClick={closeMenu}>Enquire now <ArrowUpRight size={15} /></a>
      {lightboxImage && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightboxImage(null)}><button className="lightbox-close" onClick={() => setLightboxImage(null)} aria-label="Close image"><X size={21} /></button><img src={lightboxImage} alt="Expanded Meridian Yachts moment" onClick={(event) => event.stopPropagation()} /></div>}
    </div>
  );
}

export default App;
