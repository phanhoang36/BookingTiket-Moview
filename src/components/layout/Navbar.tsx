import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(255,42,42,0.06)]">
      <div className="flex items-center justify-between px-8 py-4 w-full max-w-screen-2xl mx-auto">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-primary uppercase font-headline">
          CineVerse
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={cn(
              'font-headline tracking-tight transition-colors',
              pathname === '/' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface hover:text-primary'
            )}
          >
            Đang Chiếu
          </Link>
          <Link
            to="/"
            className="text-on-surface hover:text-primary transition-colors font-headline tracking-tight"
          >
            Sắp Chiếu
          </Link>
          <Link
            to="/admin"
            className={cn(
              'font-headline tracking-tight transition-colors px-4 py-1.5 rounded-md border',
              pathname.startsWith('/admin')
                ? 'text-primary border-primary bg-primary/10'
                : 'text-on-surface-variant border-outline-variant/30 hover:text-primary hover:border-primary'
            )}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
