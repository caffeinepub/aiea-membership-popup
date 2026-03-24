import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type Complaint = {
    id : Nat;
    name : Text;
    phone : Text;
    subject : Text;
    message : Text;
    timestamp : Int;
    image : ?Storage.ExternalBlob;
  };

  type OldActor = {
    complaints : Map.Map<Nat, Complaint>;
    nextComplaintId : Nat;
  };
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
    timestamp : Int;
    photo : ?Storage.ExternalBlob;
  };

  type NewActor = {
    complaints : Map.Map<Nat, Complaint>;
    nextComplaintId : Nat;
    licenseApplications : Map.Map<Nat, LicenseApplication>;
    nextLicenseId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      complaints = old.complaints;
      nextComplaintId = old.nextComplaintId;
      licenseApplications = Map.empty<Nat, LicenseApplication>();
      nextLicenseId = 0;
    };
  };
};
