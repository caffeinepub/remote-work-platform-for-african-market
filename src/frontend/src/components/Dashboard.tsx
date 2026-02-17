import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetCallerUserProfile, useGetCallerCompanyProfile } from '../hooks/useQueries';
import UserDashboard from './UserDashboard';
import CompanyDashboard from './CompanyDashboard';
import PaymentDashboard from './PaymentDashboard';

export default function Dashboard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: companyProfile } = useGetCallerCompanyProfile();
  const [activeTab, setActiveTab] = useState('profile');

  const hasCompany = !!companyProfile;

  return (
    <section className="py-6 md:py-8 min-h-[calc(100vh-8rem)]">
      <div className="container">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, <span className="text-gradient">{userProfile?.name}</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your profile, applications, and payments
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-12 md:h-10 md:w-auto">
            <TabsTrigger value="profile" className="text-xs md:text-sm">My Profile</TabsTrigger>
            <TabsTrigger value="company" className="text-xs md:text-sm">
              {hasCompany ? 'My Company' : 'Create Company'}
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-xs md:text-sm">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 md:mt-6">
            <UserDashboard />
          </TabsContent>

          <TabsContent value="company" className="mt-4 md:mt-6">
            <CompanyDashboard />
          </TabsContent>

          <TabsContent value="payments" className="mt-4 md:mt-6">
            <PaymentDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
