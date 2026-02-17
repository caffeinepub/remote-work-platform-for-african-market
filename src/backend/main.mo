import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Time "mo:base/Time";
import List "mo:base/List";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor RemoteWorkPlatform {
  let accessControlState = AccessControl.initState();
  let storage = Storage.new();
  include MixinStorage(storage);

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  transient let textMap = OrderedMap.Make<Text>(Text.compare);

  var userProfiles = principalMap.empty<UserProfile>();
  var companyProfiles = principalMap.empty<CompanyProfile>();
  var jobListings = textMap.empty<JobListing>();
  var jobApplications = textMap.empty<JobApplication>();
  var paymentTransactions = textMap.empty<PaymentTransaction>();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    skills : [Text];
    experience : Text;
    portfolio : [Text];
    isCompany : Bool;
  };

  public type CompanyProfile = {
    name : Text;
    description : Text;
    location : Text;
    industry : Text;
    owner : Principal;
  };

  public type JobListing = {
    id : Text;
    title : Text;
    description : Text;
    requirements : [Text];
    responsibilities : [Text];
    compensation : Text;
    category : Text;
    location : Text;
    jobType : Text;
    company : Principal;
    postedAt : Time.Time;
  };

  public type JobApplication = {
    id : Text;
    jobId : Text;
    applicant : Principal;
    status : Text;
    appliedAt : Time.Time;
  };

  public type PaymentTransaction = {
    id : Text;
    user : Principal;
    amount : Float;
    currency : Text;
    paymentModel : Text;
    timestamp : Time.Time;
    status : Text;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public shared ({ caller }) func createCompanyProfile(profile : CompanyProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create company profiles");
    };
    if (profile.owner != caller) {
      Debug.trap("Unauthorized: Can only create company profile for yourself");
    };
    companyProfiles := principalMap.put(companyProfiles, caller, profile);
  };

  public query func getCompanyProfile(company : Principal) : async ?CompanyProfile {
    principalMap.get(companyProfiles, company);
  };

  public query ({ caller }) func getCallerCompanyProfile() : async ?CompanyProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view company profiles");
    };
    principalMap.get(companyProfiles, caller);
  };

  public shared ({ caller }) func updateCompanyProfile(profile : CompanyProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update company profiles");
    };
    switch (principalMap.get(companyProfiles, caller)) {
      case null {
        Debug.trap("Unauthorized: No company profile exists for caller");
      };
      case (?existingProfile) {
        if (existingProfile.owner != caller) {
          Debug.trap("Unauthorized: Can only update your own company profile");
        };
        if (profile.owner != caller) {
          Debug.trap("Unauthorized: Cannot change company owner");
        };
        companyProfiles := principalMap.put(companyProfiles, caller, profile);
      };
    };
  };

  public query func getAllJobListings() : async [JobListing] {
    var list = List.nil<JobListing>();
    for ((_, job) in textMap.entries(jobListings)) {
      list := List.push(job, list);
    };
    List.toArray(list);
  };

  public query func getJobListing(id : Text) : async ?JobListing {
    textMap.get(jobListings, id);
  };

  public shared ({ caller }) func postJobListing(job : JobListing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can post jobs");
    };
    if (job.company != caller) {
      Debug.trap("Unauthorized: Can only post jobs for your own company");
    };
    switch (principalMap.get(companyProfiles, caller)) {
      case null {
        Debug.trap("Unauthorized: Must have a company profile to post jobs");
      };
      case (?_) {
        jobListings := textMap.put(jobListings, job.id, job);
      };
    };
  };

  public shared ({ caller }) func updateJobListing(job : JobListing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update jobs");
    };
    switch (textMap.get(jobListings, job.id)) {
      case null {
        Debug.trap("Job listing not found");
      };
      case (?existingJob) {
        if (existingJob.company != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only update your own job listings");
        };
        if (job.company != existingJob.company) {
          Debug.trap("Unauthorized: Cannot change job company");
        };
        jobListings := textMap.put(jobListings, job.id, job);
      };
    };
  };

  public shared ({ caller }) func deleteJobListing(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete jobs");
    };
    switch (textMap.get(jobListings, id)) {
      case null {
        Debug.trap("Job listing not found");
      };
      case (?existingJob) {
        if (existingJob.company != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only delete your own job listings");
        };
        jobListings := textMap.delete(jobListings, id);
      };
    };
  };

  public query ({ caller }) func getCompanyJobListings() : async [JobListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view company job listings");
    };
    var list = List.nil<JobListing>();
    for ((_, job) in textMap.entries(jobListings)) {
      if (job.company == caller) {
        list := List.push(job, list);
      };
    };
    List.toArray(list);
  };

  public shared ({ caller }) func applyForJob(application : JobApplication) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can apply for jobs");
    };
    if (application.applicant != caller) {
      Debug.trap("Unauthorized: Can only apply for jobs as yourself");
    };
    switch (textMap.get(jobListings, application.jobId)) {
      case null {
        Debug.trap("Job listing not found");
      };
      case (?_) {
        jobApplications := textMap.put(jobApplications, application.id, application);
      };
    };
  };

  public query ({ caller }) func getUserApplications() : async [JobApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view applications");
    };
    var list = List.nil<JobApplication>();
    for ((_, application) in textMap.entries(jobApplications)) {
      if (application.applicant == caller) {
        list := List.push(application, list);
      };
    };
    List.toArray(list);
  };

  public query ({ caller }) func getJobApplications(jobId : Text) : async [JobApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view job applications");
    };
    switch (textMap.get(jobListings, jobId)) {
      case null {
        Debug.trap("Job listing not found");
      };
      case (?job) {
        if (job.company != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only view applications for your own jobs");
        };
        var list = List.nil<JobApplication>();
        for ((_, application) in textMap.entries(jobApplications)) {
          if (application.jobId == jobId) {
            list := List.push(application, list);
          };
        };
        List.toArray(list);
      };
    };
  };

  public shared ({ caller }) func updateApplicationStatus(applicationId : Text, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update application status");
    };
    switch (textMap.get(jobApplications, applicationId)) {
      case null {
        Debug.trap("Application not found");
      };
      case (?application) {
        switch (textMap.get(jobListings, application.jobId)) {
          case null {
            Debug.trap("Job listing not found");
          };
          case (?job) {
            if (job.company != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Debug.trap("Unauthorized: Can only update applications for your own jobs");
            };
            let updatedApplication = {
              id = application.id;
              jobId = application.jobId;
              applicant = application.applicant;
              status = newStatus;
              appliedAt = application.appliedAt;
            };
            jobApplications := textMap.put(jobApplications, applicationId, updatedApplication);
          };
        };
      };
    };
  };

  public shared ({ caller }) func processPayment(transaction : PaymentTransaction) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can process payments");
    };
    if (transaction.user != caller) {
      Debug.trap("Unauthorized: Can only process payments for yourself");
    };
    paymentTransactions := textMap.put(paymentTransactions, transaction.id, transaction);
  };

  public query ({ caller }) func getUserPayments() : async [PaymentTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view payments");
    };
    var list = List.nil<PaymentTransaction>();
    for ((_, payment) in textMap.entries(paymentTransactions)) {
      if (payment.user == caller) {
        list := List.push(payment, list);
      };
    };
    List.toArray(list);
  };

  public query ({ caller }) func getAllPayments() : async [PaymentTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all payments");
    };
    var list = List.nil<PaymentTransaction>();
    for ((_, payment) in textMap.entries(paymentTransactions)) {
      list := List.push(payment, list);
    };
    List.toArray(list);
  };

  public query ({ caller }) func getAllApplications() : async [JobApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all applications");
    };
    var list = List.nil<JobApplication>();
    for ((_, application) in textMap.entries(jobApplications)) {
      list := List.push(application, list);
    };
    List.toArray(list);
  };

  public query ({ caller }) func getAllCompanyProfiles() : async [CompanyProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all company profiles");
    };
    var list = List.nil<CompanyProfile>();
    for ((_, company) in principalMap.entries(companyProfiles)) {
      list := List.push(company, list);
    };
    List.toArray(list);
  };
};
