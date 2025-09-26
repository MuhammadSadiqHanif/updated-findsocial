import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface StatsData {
  total_leads: number
  platforms: {
    instagram: number
    tiktok: number
    youtube: number
    spotify: number
    soundcloud: number
  }
  searches: {
    instagram: number
    tiktok: number
    youtube: number
    spotify: number
    soundcloud: number
  }
  deep_search_results: number
  llm_generated_results: number
  platform_deep_search: {
    instagram: number
    tiktok: number
    youtube: number
    spotify: number
    soundcloud: number
  }
  platform_llm_generated: {
    instagram: number
    tiktok: number
    youtube: number
    spotify: number
    soundcloud: number
  }
  recent_activity: Array<{
    platform: string
    search: string
    username: string
    timestamp: string
    deep_search: boolean
    llm_generated: boolean
  }>
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function MetricsCards({ userId }: { userId: string | null }) {
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`https://dev-api.findsocial.io/leads/stats?auth0_id=${userId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`)
        }

        const data: StatsData = await response.json()
        setStatsData(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId, toast])

  // Calculate total searches across all platforms
  const getTotalSearches = (searches: StatsData['searches']) => {
    return Object.values(searches).reduce((sum, count) => sum + count, 0)
  }

  // Show loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="bg-[#ffffff] border-[#eaecf0]">
            <CardContent className="p-6 py-0">
              <div className="space-y-2">
                <div className="h-4 bg-[#f2f4f7] rounded animate-pulse"></div>
                <div className="h-8 bg-[#f2f4f7] rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Show default values if no data or userId
  if (!statsData || !userId) {
    const defaultMetrics = [
      {
        label: "Total Searches",
        value: "0",
      },
      {
        label: "Generated Results",
        value: "0",
      },
      {
        label: "Deep Searches",
        value: "0",
      },
      {
        label: "AI Semantic Searches",
        value: "0",
      },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {defaultMetrics.map((metric) => (
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

  const metrics = [
    {
      label: "Total Searches",
      value: formatNumber(getTotalSearches(statsData.searches)),
    },
    {
      label: "Generated Results",
      value: formatNumber(statsData.total_leads),
    },
    {
      label: "Deep Searches",
      value: formatNumber(statsData.deep_search_results),
    },
    {
      label: "AI Semantic Searches",
      value: formatNumber(statsData.llm_generated_results),
    },
  ]

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
