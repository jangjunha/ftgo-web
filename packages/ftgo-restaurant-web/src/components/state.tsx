import { TicketState } from "../__generated__/graphql";

const State = ({ state }: { state: TicketState }): React.ReactElement => {
  console.log(state);
  switch (state) {
    case TicketState.CreatePending:
      return <span>주문 생성 중</span>;
    case TicketState.AwaitingAcceptance:
      return <span>접수 대기</span>;
    case TicketState.Accepted:
      return <span>접수됨</span>;
    case TicketState.Cancelled:
      return <span>취소됨</span>;
    case TicketState.CancelPending:
      return <span>취소 요청</span>;
    case TicketState.Preparing:
      return <span>조리 중</span>;
    case TicketState.ReadyForPickup:
      return <span>배달 준비됨</span>;
    case TicketState.PickedUp:
      return <span>픽업 완료</span>;
    case TicketState.RevisionPending:
      return <span>변경 요청</span>;
  }
};
export default State;
