import { useState } from "react";
import { Link } from "react-router";

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-[var(--gradient-mid)]/30 overflow-x-hidden shimmer">
      
      {/* Form AI Title - Top Center */}
      <div className="form-ai-title">Form AI</div>

      {/* Magical Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Moving Stars */}
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
        <div className="star star-6"></div>
        <div className="star star-7"></div>
        <div className="star star-8"></div>
        
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-[var(--gradient-start)]/20 via-[var(--gradient-mid)]/20 to-[var(--gradient-end)]/20 rounded-full blur-[200px] animate-pulse-slow mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[var(--gradient-mid)]/20 via-[var(--gradient-end)]/20 to-[var(--gradient-accent)]/20 rounded-full blur-[180px] animate-pulse-slow delay-700 mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-gradient-to-br from-[var(--gradient-end)]/20 via-[var(--gradient-accent)]/20 to-[var(--gradient-pink)]/20 rounded-full blur-[160px] animate-pulse-slow delay-1500 mix-blend-screen" />
        
        {/* Floating sparkles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--gradient-start)] rounded-full animate-sparkle delay-0" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[var(--gradient-mid)] rounded-full animate-sparkle delay-500" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[var(--gradient-end)] rounded-full animate-sparkle delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-[var(--gradient-accent)] rounded-full animate-sparkle delay-1500" />
        
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 glass-effect backdrop-blur-xl supports-[backdrop-filter]:glass-effect">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 magical-bg rounded-xl flex items-center justify-center animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white neon-text">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent magical-bg neon-text animate-gradient-x">
              FormAI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
            >
              {isDarkMode ? '🌙' : '☀️'} {isDarkMode ? 'Dark' : 'Light'}
            </button>
            <Link
              to="/builder"
              className="px-6 py-2.5 glass-effect hover:bg-white/10 border border-white/20 text-white rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            >
              Get Started
            </Link>
            <Link
              to="/created"
              className="px-6 py-2.5 glass-effect hover:bg-white/10 border border-white/20 text-white rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]"
            >
              📝 My Forms
            </Link>
            <Link
              to="/responses"
              className="px-6 py-2.5 glass-effect hover:bg-white/10 border border-white/20 text-white rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,204,255,0.3)]"
            >
              📊 Responses
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-[var(--gradient-start)]/30 text-sm font-medium text-[var(--gradient-start)] mb-4 animate-float">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gradient-start)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--gradient-start)] neon-text"></span>
            </span>
            ✨ New: AI-Powered Form Generation
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white animate-float delay-100">
            Build Magical Forms <br />
            <span className="bg-clip-text text-transparent magical-bg neon-text animate-gradient-x">in Seconds with AI</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed animate-float delay-200">
            Describe your dream form, and watch our AI weave digital magic to create perfect structure.
            Customize, preview, and share instantly with a sprinkle of ✨
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-float delay-300">
            <Link
              to="/builder"
              className="w-full sm:w-auto px-8 py-4 magical-bg text-white rounded-xl font-bold text-lg hover:shadow-[0_0_40px_-10px_var(--gradient-mid)] transition-all transform hover:-translate-y-1 hover:scale-105 neon-text"
            >
              ✨ Start Creating Magic
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 glass-effect text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/10 transition-all hover:scale-105">
              🎭 View Examples
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {[
            {
              title: "✨ AI Magic",
              desc: "Just whisper 'Job Application' and watch AI conjure a perfect form instantly.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--gradient-start)] neon-text"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 3v4" /><path d="M5 11V7" /><path d="M9 11V7" /></svg>
              )
            },
            {
              title: "📊 Crystal Analytics",
              desc: "See responses sparkle with built-in charts and magical data galleries.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--gradient-mid)] neon-text"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
              )
            },
            {
              title: "🌐 Instant Sharing",
              desc: "One-click publishing with magical CDN distribution across realm.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--gradient-end)] neon-text"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
              )
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 glass-effect border border-white/10 rounded-2xl hover:border-[var(--gradient-mid)]/50 transition-all hover:shadow-[0_0_40px_-10px_rgba(255,0,255,0.3)] relative overflow-hidden hover:scale-105">
              <div className="absolute inset-0 magical-bg opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="w-14 h-14 glass-effect rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-[var(--gradient-mid)]/50 relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10 neon-text">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed relative z-10">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-[var(--bg-dark)]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-white/60 text-sm">
                Built with ❤️ by FormAI - Transforming forms with magic
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://www.linkedin.com/in/adrika-mandal-753226246/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 hover:border-blue-500/50 transition-all group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              <a 
                href="mailto:adrika.mandal01@gmail.com" 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-lg text-green-300 hover:text-green-200 hover:border-green-500/50 transition-all group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Email</span>
              </a>
              <a 
                href="https://instagram.com/_adrika_mandal_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg text-pink-300 hover:text-pink-200 hover:border-pink-500/50 transition-all group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm font-medium">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
