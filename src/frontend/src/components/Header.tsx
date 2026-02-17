import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Moon, Sun, Briefcase, LayoutDashboard, Menu, Download, LogIn, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface HeaderProps {
  onDashboardClick: () => void;
  showDashboard: boolean;
  onInstallGuideClick: () => void;
}

export default function Header({ onDashboardClick, showDashboard, onInstallGuideClick }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b glass-effect">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Briefcase className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">AfricaWork</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Remote Opportunities</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          {isAuthenticated && userProfile && (
            <>
              <Button
                variant={showDashboard ? "default" : "ghost"}
                size="sm"
                onClick={onDashboardClick}
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {userProfile.name}
              </span>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onInstallGuideClick}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Install App
          </Button>

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? "outline" : "default"}
            size="sm"
            className={isAuthenticated ? "" : "gradient-primary shadow-glow"}
          >
            {buttonText}
          </Button>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] glass-effect">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-8">
              {isAuthenticated && userProfile && (
                <>
                  <div className="px-4 py-3 rounded-lg bg-primary/10">
                    <p className="text-sm text-muted-foreground">Logged in as</p>
                    <p className="font-semibold">{userProfile.name}</p>
                  </div>
                  <Button
                    variant={showDashboard ? "default" : "outline"}
                    onClick={() => {
                      onDashboardClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                }}
                className="w-full justify-start gap-2"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  onInstallGuideClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-2"
              >
                <Download className="w-4 h-4" />
                Install App
              </Button>

              <Button
                onClick={handleAuth}
                disabled={disabled}
                variant={isAuthenticated ? "outline" : "default"}
                className={`w-full justify-start gap-2 ${isAuthenticated ? "" : "gradient-primary shadow-glow"}`}
              >
                {isAuthenticated ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {buttonText}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
