import type { TicketState } from "@ftgo/util";

const State = ({ state }: { state: TicketState }): React.ReactElement => {
  switch (state) {
    case "CREATE_PENDING":
      return <span>Create Pending</span>;
    case "AWAITING_ACCEPTANCE":
      return <span>Wait for Accept</span>;
    case "ACCEPTED":
      return <span>Accepted</span>;
    case "CANCELLED":
      return <span>Cancelled</span>;
    case "CANCEL_PENDING":
      return <span>Pending Cancel</span>;
    case "PREPARING":
      return <span>Preparing</span>;
    case "READY_FOR_PICKUP":
      return <span>Ready for Pickup</span>;
    case "PICKED_UP":
      return <span>Picked up</span>;
    case "REVISION_PENDING":
      return <span>Revision Pending</span>;
  }
};
export default State;
