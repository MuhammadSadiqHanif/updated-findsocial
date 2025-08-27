"use client"

import { Button } from "@/components/ui/button"
// import { Gift, Bell, Layers } from "lucide-react"
import Gift from "@/public/top-bar/gift.png"
import Bell from "@/public/top-bar/bell.png"
import Layers from "@/public/top-bar/layers.png"
import Image from "next/image"
export function TopBar() {
  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Search</h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Image src={Gift} alt="Gift" className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Image src={Bell} alt="Bell" className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Image src={Layers} alt="Layers" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
