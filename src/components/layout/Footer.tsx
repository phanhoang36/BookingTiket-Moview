import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full py-12 px-8 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-screen-2xl mx-auto gap-6">
        <div className="text-lg font-bold text-tertiary font-headline uppercase tracking-tighter">
          CINEVERSE
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-body text-sm tracking-wide">
          <Link to="/" className="text-on-surface/60 hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/" className="text-on-surface/60 hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/" className="text-on-surface/60 hover:text-primary transition-colors">VIP Membership</Link>
          <Link to="/" className="text-on-surface/60 hover:text-primary transition-colors">Contact Us</Link>
        </div>
        <div className="text-on-surface/40 font-body text-xs">
          © 2026 CineVerse. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
