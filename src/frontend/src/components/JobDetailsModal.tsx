import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useApplyForJob, useGetCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, DollarSign, Clock, Briefcase, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { JobListing } from '../backend';

interface JobDetailsModalProps {
  job: JobListing;
  onClose: () => void;
}

export default function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const applyMutation = useApplyForJob();
  const [hasApplied, setHasApplied] = useState(false);

  const isAuthenticated = !!identity;

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for jobs');
      return;
    }

    if (!userProfile) {
      toast.error('Please complete your profile first');
      return;
    }

    if (!identity) return;

    const application = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      jobId: job.id,
      applicant: identity.getPrincipal(),
      status: 'pending',
      appliedAt: BigInt(Date.now() * 1000000),
    };

    try {
      await applyMutation.mutateAsync(application);
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application');
      console.error(error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex gap-2">
              <Badge variant="secondary">{job.category}</Badge>
              <Badge variant="outline">{job.jobType}</Badge>
            </div>
          </div>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-base">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(job.postedAt)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/10">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="font-semibold">{job.compensation}</span>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Job Description</h3>
            <p className="text-muted-foreground">{job.description}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Responsibilities
            </h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Requirements
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            {hasApplied ? (
              <Button className="flex-1" disabled>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Application Submitted
              </Button>
            ) : (
              <Button 
                className="flex-1 gradient-primary shadow-glow" 
                onClick={handleApply}
                disabled={applyMutation.isPending}
              >
                {applyMutation.isPending ? 'Submitting...' : 'Apply Now'}
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
