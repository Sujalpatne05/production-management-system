import { Badge } from "@/components/ui/badge";

type StatusKind =
  | "paid"
  | "partial"
  | "unpaid"
  | "sent"
  | "accepted"
  | "rejected"
  | "running"
  | "completed"
  | "cancelled";

interface StatusBadgeProps {
  status: StatusKind | string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const s = String(status).toLowerCase();
  switch (s) {
    case "paid":
      return <Badge className="bg-green-600 text-white">Paid</Badge>;
    case "partial":
      return <Badge className="bg-yellow-500 text-black">Partial</Badge>;
    case "unpaid":
      return <Badge variant="destructive">Unpaid</Badge>;
    case "sent":
      return <Badge className="bg-blue-600 text-white">Sent</Badge>;
    case "accepted":
      return <Badge className="bg-green-600 text-white">Accepted</Badge>;
    case "rejected":
      return <Badge className="bg-red-600 text-white">Rejected</Badge>;
    case "running":
      return <Badge className="bg-blue-600 text-white">Running</Badge>;
    case "completed":
      return <Badge className="bg-green-600 text-white">Completed</Badge>;
    case "cancelled":
      return <Badge className="bg-red-600 text-white">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default StatusBadge;
