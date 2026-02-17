import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { 
  useGetCallerCompanyProfile, 
  useCreateCompanyProfile, 
  useUpdateCompanyProfile,
  useGetCompanyJobListings,
  usePostJobListing,
  useDeleteJobListing,
  useGetJobApplications
} from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import JobPostModal from './JobPostModal';
import type { CompanyProfile } from '../backend';

export default function CompanyDashboard() {
  const { identity } = useInternetIdentity();
  const { data: companyProfile, isLoading } = useGetCallerCompanyProfile();
  const { data: companyJobs = [] } = useGetCompanyJobListings();
  const createMutation = useCreateCompanyProfile();
  const updateMutation = useUpdateCompanyProfile();
  const deleteMutation = useDeleteJobListing();

  const [isEditing, setIsEditing] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({
    name: '',
    description: '',
    location: '',
    industry: '',
  });

  const hasCompany = !!companyProfile;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const profile: CompanyProfile = {
      name: formData.name || '',
      description: formData.description || '',
      location: formData.location || '',
      industry: formData.industry || '',
      owner: identity.getPrincipal(),
    };

    try {
      if (hasCompany) {
        await updateMutation.mutateAsync(profile);
        toast.success('Company profile updated!');
      } else {
        await createMutation.mutateAsync(profile);
        toast.success('Company profile created!');
      }
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save company profile');
      console.error(error);
    }
  };

  const handleEdit = () => {
    if (companyProfile) {
      setFormData(companyProfile);
    }
    setIsEditing(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await deleteMutation.mutateAsync(jobId);
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-effect">
        <CardContent className="p-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasCompany && !isEditing) {
    return (
      <Card className="glass-effect">
        <CardContent className="p-12 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Create Your Company Profile</h3>
          <p className="text-muted-foreground mb-6">
            Set up your company profile to start posting jobs
          </p>
          <Button onClick={() => setIsEditing(true)} className="gradient-primary shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Create Company Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isEditing || !hasCompany) {
    return (
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>
            {hasCompany ? 'Edit Company Profile' : 'Create Company Profile'}
          </CardTitle>
          <CardDescription>
            {hasCompany ? 'Update your company information' : 'Set up your company to start posting jobs'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Acme Inc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Technology"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Lagos, Nigeria"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about your company..."
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="gradient-primary shadow-glow"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Profile'}
              </Button>
              {hasCompany && (
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {companyProfile.name}
              </CardTitle>
              <CardDescription>{companyProfile.industry} • {companyProfile.location}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{companyProfile.description}</p>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Job Postings</CardTitle>
              <CardDescription>Manage your company's job listings</CardDescription>
            </div>
            <Button onClick={() => setShowJobModal(true)} className="gradient-primary shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {companyJobs.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
              <p className="text-muted-foreground">
                Create your first job posting to start hiring
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {companyJobs.map(job => (
                <JobCard key={job.id} job={job} onDelete={handleDeleteJob} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showJobModal && (
        <JobPostModal onClose={() => setShowJobModal(false)} />
      )}
    </div>
  );
}

function JobCard({ job, onDelete }: { job: any; onDelete: (id: string) => void }) {
  const { data: applications = [] } = useGetJobApplications(job.id);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">{job.title}</h4>
              <Badge variant="secondary">{job.category}</Badge>
              <Badge variant="outline">{job.jobType}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {job.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.compensation}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {applications.length} applicants
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(job.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
