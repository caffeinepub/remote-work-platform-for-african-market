import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CompanyProfile {
    owner: Principal;
    name: string;
    description: string;
    location: string;
    industry: string;
}
export type Time = bigint;
export interface JobApplication {
    id: string;
    status: string;
    applicant: Principal;
    appliedAt: Time;
    jobId: string;
}
export interface JobListing {
    id: string;
    compensation: string;
    title: string;
    postedAt: Time;
    responsibilities: Array<string>;
    jobType: string;
    description: string;
    company: Principal;
    category: string;
    requirements: Array<string>;
    location: string;
}
export interface PaymentTransaction {
    id: string;
    status: string;
    user: Principal;
    currency: string;
    timestamp: Time;
    paymentModel: string;
    amount: number;
}
export interface UserProfile {
    portfolio: Array<string>;
    name: string;
    email: string;
    experience: string;
    isCompany: boolean;
    skills: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyForJob(application: JobApplication): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCompanyProfile(profile: CompanyProfile): Promise<void>;
    deleteJobListing(id: string): Promise<void>;
    getAllApplications(): Promise<Array<JobApplication>>;
    getAllCompanyProfiles(): Promise<Array<CompanyProfile>>;
    getAllJobListings(): Promise<Array<JobListing>>;
    getAllPayments(): Promise<Array<PaymentTransaction>>;
    getCallerCompanyProfile(): Promise<CompanyProfile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompanyJobListings(): Promise<Array<JobListing>>;
    getCompanyProfile(company: Principal): Promise<CompanyProfile | null>;
    getJobApplications(jobId: string): Promise<Array<JobApplication>>;
    getJobListing(id: string): Promise<JobListing | null>;
    getUserApplications(): Promise<Array<JobApplication>>;
    getUserPayments(): Promise<Array<PaymentTransaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    postJobListing(job: JobListing): Promise<void>;
    processPayment(transaction: PaymentTransaction): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateApplicationStatus(applicationId: string, newStatus: string): Promise<void>;
    updateCompanyProfile(profile: CompanyProfile): Promise<void>;
    updateJobListing(job: JobListing): Promise<void>;
}