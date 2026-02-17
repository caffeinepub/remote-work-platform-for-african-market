import { Search, Briefcase, Users, Coins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-10" />
      
      <div className="container relative py-12 md:py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 animate-fade-in text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your Dream <span className="text-gradient">Remote Job</span> in Africa
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Connect with top companies offering remote opportunities. Get paid in cryptocurrency for your skills and expertise.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 pt-4">
              <Card className="glass-effect hover:shadow-glow transition-all duration-300">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Jobs</p>
                    <p className="text-xs text-muted-foreground">Find opportunities</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect hover:shadow-glow transition-all duration-300">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold">Companies</p>
                    <p className="text-xs text-muted-foreground">Top employers</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect hover:shadow-glow transition-all duration-300">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Crypto Pay</p>
                    <p className="text-xs text-muted-foreground">Secure payments</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <img 
              src="/assets/generated/hero-image.dim_1200x600.jpg" 
              alt="Remote work" 
              className="relative rounded-2xl md:rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
