import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Home, LayoutDashboard, Download, User } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface MobileNavProps {
  showDashboard: boolean;
  onDashboardClick: () => void;
  onInstallGuideClick: () => void;
}

export default function MobileNav({ showDashboard, onDashboardClick, onInstallGuideClick }: MobileNavProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t glass-effect">
      <div className="grid grid-cols-4 gap-1 p-2">
        <Button
          variant={!showDashboard ? "default" : "ghost"}
          size="sm"
          onClick={() => !showDashboard && window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-col h-14 gap-1"
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Button>

        {isAuthenticated && userProfile && (
          <Button
            variant={showDashboard ? "default" : "ghost"}
            size="sm"
            onClick={onDashboardClick}
            className="flex-col h-14 gap-1"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onInstallGuideClick}
          className="flex-col h-14 gap-1"
        >
          <Download className="w-5 h-5" />
          <span className="text-xs">Install</span>
        </Button>

        {isAuthenticated && userProfile && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-14 gap-1"
          >
            <User className="w-5 h-5" />
            <span className="text-xs truncate max-w-[60px]">{userProfile.name.split(' ')[0]}</span>
          </Button>
        )}
      </div>
    </nav>
  );
}
