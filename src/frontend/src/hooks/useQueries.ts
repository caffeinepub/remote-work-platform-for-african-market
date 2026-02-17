import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  CompanyProfile, 
  JobListing, 
  JobApplication, 
  PaymentTransaction 
} from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerCompanyProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<CompanyProfile | null>({
    queryKey: ['currentCompanyProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerCompanyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCompanyProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: CompanyProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCompanyProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentCompanyProfile'] });
    },
  });
}

export function useUpdateCompanyProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: CompanyProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCompanyProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentCompanyProfile'] });
    },
  });
}

export function useGetAllJobListings() {
  const { actor, isFetching } = useActor();

  return useQuery<JobListing[]>({
    queryKey: ['jobListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCompanyJobListings() {
  const { actor, isFetching } = useActor();

  return useQuery<JobListing[]>({
    queryKey: ['companyJobListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCompanyJobListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePostJobListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (job: JobListing) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postJobListing(job);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobListings'] });
      queryClient.invalidateQueries({ queryKey: ['companyJobListings'] });
    },
  });
}

export function useUpdateJobListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (job: JobListing) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJobListing(job);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobListings'] });
      queryClient.invalidateQueries({ queryKey: ['companyJobListings'] });
    },
  });
}

export function useDeleteJobListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJobListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobListings'] });
      queryClient.invalidateQueries({ queryKey: ['companyJobListings'] });
    },
  });
}

export function useApplyForJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (application: JobApplication) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyForJob(application);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userApplications'] });
    },
  });
}

export function useGetUserApplications() {
  const { actor, isFetching } = useActor();

  return useQuery<JobApplication[]>({
    queryKey: ['userApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJobApplications(jobId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<JobApplication[]>({
    queryKey: ['jobApplications', jobId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobApplications(jobId);
    },
    enabled: !!actor && !isFetching && !!jobId,
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, newStatus }: { applicationId: string; newStatus: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateApplicationStatus(applicationId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications'] });
    },
  });
}

export function useProcessPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: PaymentTransaction) => {
      if (!actor) throw new Error('Actor not available');
      return actor.processPayment(transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPayments'] });
    },
  });
}

export function useGetUserPayments() {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentTransaction[]>({
    queryKey: ['userPayments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserPayments();
    },
    enabled: !!actor && !isFetching,
  });
}
