import Text "mo:core/Text";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Migration "migration";

// with clause for stable to stable migration
(with migration = Migration.run)
actor {
  // Include persistent storage logic
  include MixinStorage();

  // Complaint record type
  type Complaint = {
    id : Nat;
    name : Text;
    phone : Text;
    subject : Text;
    message : Text;
    timestamp : Time.Time;
    image : ?Storage.ExternalBlob;
  };

  // Association details
  let associationName = "All India Electrician Association";
  let contactEmail = "contact@aiea.org";
  let headquarters = "Delhi, India";
  let membershipFormUrl = "https://docs.google.com/membership-form";

  // Static informational content
  public query func getAssociationInfo() : async Text {
    "Welcome to " # associationName # ". Reach us at " # contactEmail # ". HQ: " # headquarters;
  };

  // Membership form URL for popup
  public query ({ caller }) func getMembershipFormUrl() : async Text {
    membershipFormUrl;
  };

  // List of services offered
  public query ({ caller }) func getServices() : async [Text] {
    let services = List.empty<Text>();
    services.add("Electrical Safety Training");
    services.add("Certification Support");
    services.add("Industry Networking");
    services.add("Technical Workshops");
    services.toArray();
  };

  // Static FAQ section
  public query ({ caller }) func getFaqs() : async [Text] {
    let faqs = List.empty<Text>();
    faqs.add("Q: Is membership open to all electricians?");
    faqs.add("A: Yes, any certified electrician can apply.");
    faqs.add("Q: Are there membership fees?");
    faqs.add("A: Yes, details are on the membership form.");
    faqs.toArray();
  };

  // Active complaints storage
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
};
