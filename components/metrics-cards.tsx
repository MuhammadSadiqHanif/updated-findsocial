import { Card, CardContent } from "@/components/ui/card"

const metrics = [
  {
    label: "Total Searches",
    value: "1097",
  },
  {
    label: "Generated Results",
    value: "8.236K",
  },
  {
    label: "Deep Searches",
    value: "641",
  },
  {
    label: "AI Semantic Searches",
    value: "438",
  },
]

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-[#ffffff] border-[#eaecf0]">
          <CardContent className="p-6 py-0">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#667085]">{metric.label}</p>
              <p className="text-3xl font-semibold text-[#101828]">{metric.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
