import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t glass-effect mt-auto">
      <div className="container py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-base md:text-lg mb-1">AfricaWork</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Connecting African talent with global opportunities
            </p>
          </div>
          
          <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
            © 2025. Built with <Heart className="w-3 h-3 md:w-4 md:h-4 text-destructive fill-destructive" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
