import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import JobListings from './components/JobListings';
import ProfileSetupModal from './components/ProfileSetupModal';
import Dashboard from './components/Dashboard';
import MobileNav from './components/MobileNav';
import InstallGuide from './components/InstallGuide';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showDashboard, setShowDashboard] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (!isAuthenticated) {
      setShowDashboard(false);
    }
  }, [isAuthenticated]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col pb-16 md:pb-0">
        <Header 
          onDashboardClick={() => setShowDashboard(!showDashboard)} 
          showDashboard={showDashboard}
          onInstallGuideClick={() => setShowInstallGuide(true)}
        />
        
        <main className="flex-1">
          {showProfileSetup && <ProfileSetupModal />}
          
          {!showDashboard ? (
            <>
              <Hero />
              <JobListings />
            </>
          ) : (
            <Dashboard />
          )}
        </main>

        <Footer />
        
        {/* Mobile Bottom Navigation */}
        <MobileNav 
          showDashboard={showDashboard}
          onDashboardClick={() => setShowDashboard(!showDashboard)}
          onInstallGuideClick={() => setShowInstallGuide(true)}
        />

        {showInstallGuide && (
          <InstallGuide onClose={() => setShowInstallGuide(false)} />
        )}

        <Toaster />
      </div>
    </ThemeProvider>
  );
}
