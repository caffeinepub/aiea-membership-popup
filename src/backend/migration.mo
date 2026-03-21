import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  // Persistent state from new canister version
  type Complaint = {
    id : Nat;
    name : Text;
    phone : Text;
    subject : Text;
    message : Text;
    timestamp : Time.Time;
    image : ?Blob;
  };

  type Actor = {
    complaints : Map.Map<Nat, Complaint>;
    nextComplaintId : Nat;
  };

  // Persistent state from really old canister versions (did not contain these variables)
  type PreviousActor = {};

  public func run(_old : PreviousActor) : Actor {
    { complaints = Map.empty<Nat, Complaint>(); nextComplaintId = 0 };
  };
};
