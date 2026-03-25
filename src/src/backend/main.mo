import Text "mo:core/Text";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

actor {
  include MixinStorage();

  type Complaint = {
    id : Nat;
    name : Text;
    phone : Text;
    subject : Text;
    message : Text;
    timestamp : Time.Time;
    image : ?Storage.ExternalBlob;
  };

  let associationName = "All India Electrician Association";
  let contactEmail = "contact@aiea.org";
  let headquarters = "Delhi, India";
  let membershipFormUrl = "https://docs.google.com/membership-form";

  public query func getAssociationInfo() : async Text {
    "Welcome to " # associationName # ". Reach us at " # contactEmail # ". HQ: " # headquarters;
  };

  public query ({ caller }) func getMembershipFormUrl() : async Text {
    membershipFormUrl;
  };

  public query ({ caller }) func getServices() : async [Text] {
    let services = List.empty<Text>();
    services.add("Electrical Safety Training");
    services.add("Certification Support");
    services.add("Industry Networking");
    services.add("Technical Workshops");
    services.toArray();
  };

  public query ({ caller }) func getFaqs() : async [Text] {
    let faqs = List.empty<Text>();
    faqs.add("Q: Is membership open to all electricians?");
    faqs.add("A: Yes, any certified electrician can apply.");
    faqs.add("Q: Are there membership fees?");
    faqs.add("A: Yes, details are on the membership form.");
    faqs.toArray();
  };

  var nextComplaintId = 0;
  let complaints = Map.empty<Nat, Complaint>();

  public shared ({ caller }) func submitComplaint(name : Text, phone : Text, subject : Text, message : Text, image : ?Storage.ExternalBlob) : async Nat {
    let complaintId = nextComplaintId;
    let complaint : Complaint = {
      id = complaintId;
      name;
      phone;
      subject;
      message;
      timestamp = Time.now();
      image;
    };
    complaints.add(complaintId, complaint);
    nextComplaintId += 1;
    complaintId;
  };

  public shared ({ caller }) func getComplaints() : async [Complaint] {
    complaints.values().toArray();
  };

  // Original LicenseApplication type — must not change to preserve stable compatibility
  type LicenseApplicationStored = {
    id : Nat;
    fullName : Text;
    mobile : Text;
    email : Text;
    dob : Text;
    licenceType : Text;
    address : Text;
    district : Text;
    state : Text;
    timestamp : Time.Time;
    photo : ?Storage.ExternalBlob;
  };

  // Status stored separately to avoid stable migration errors
  // Returns type exposed to frontend (includes status and paymentScreenshot)
  type LicenseApplication = {
    id : Nat;
    fullName : Text;
    mobile : Text;
    email : Text;
    dob : Text;
    licenceType : Text;
    address : Text;
    district : Text;
    state : Text;
    timestamp : Time.Time;
    photo : ?Storage.ExternalBlob;
    status : Text;
    paymentScreenshot : ?Storage.ExternalBlob;
  };

  var nextLicenseId = 0;
  let licenseApplications = Map.empty<Nat, LicenseApplicationStored>();
  let licenseApplicationStatuses = Map.empty<Nat, Text>();
  let licensePaymentScreenshots = Map.empty<Nat, Storage.ExternalBlob>();

  public shared ({ caller }) func submitLicenseApplication(fullName : Text, mobile : Text, email : Text, dob : Text, licenceType : Text, address : Text, district : Text, state : Text, photo : ?Storage.ExternalBlob, paymentScreenshot : ?Storage.ExternalBlob) : async Nat {
    let applicationId = nextLicenseId;
    let application : LicenseApplicationStored = {
      id = applicationId;
      fullName;
      mobile;
      email;
      dob;
      licenceType;
      address;
      district;
      state;
      timestamp = Time.now();
      photo;
    };
    licenseApplications.add(applicationId, application);
    licenseApplicationStatuses.add(applicationId, "Pending");
    switch (paymentScreenshot) {
      case (?ps) { licensePaymentScreenshots.add(applicationId, ps); };
      case null {};
    };
    nextLicenseId += 1;
    applicationId;
  };

  public shared ({ caller }) func getLicenseApplications() : async [LicenseApplication] {
    let result = List.empty<LicenseApplication>();
    for (app in licenseApplications.values()) {
      let status = switch (licenseApplicationStatuses.get(app.id)) {
        case (?s) { s };
        case null { "Pending" };
      };
      let paymentScreenshot = licensePaymentScreenshots.get(app.id);
      result.add({
        id = app.id;
        fullName = app.fullName;
        mobile = app.mobile;
        email = app.email;
        dob = app.dob;
        licenceType = app.licenceType;
        address = app.address;
        district = app.district;
        state = app.state;
        timestamp = app.timestamp;
        photo = app.photo;
        status;
        paymentScreenshot;
      });
    };
    result.toArray();
  };

  public shared ({ caller }) func updateLicenseApplicationStatus(id : Nat, newStatus : Text) : async Bool {
    switch (licenseApplications.get(id)) {
      case (?_) {
        licenseApplicationStatuses.add(id, newStatus);
        true;
      };
      case null { false };
    };
  };
};
