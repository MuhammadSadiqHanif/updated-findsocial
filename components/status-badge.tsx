import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "in-progress" | "pending" | "no-data" | "error" | "completed"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    "in-progress": {
      label: "In Progress",
      className: "bg-[#f0f9ff] text-[#026aa2] border-[#b9e6fe] hover:bg-[#f0f9ff]",
    },
    pending: {
      label: "Pending",
      className: "bg-[#fffaeb] text-[#b54708] border-[#fedf89] hover:bg-[#fffaeb]",
    },
    "no-data": {
      label: "No Data Found",
      className: "bg-[#fffaeb] text-[#b54708] border-[#fedf89] hover:bg-[#fffaeb]",
    },
    error: {
      label: "Error",
      className: "bg-[#fef3f2] text-[#b42318] border-[#fecdca] hover:bg-[#fef3f2]",
    },
    completed: {
      label: "Completed",
      className: "bg-[#ecfdf3] text-[#067647] border-[#abefc6] hover:bg-[#ecfdf3]",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
