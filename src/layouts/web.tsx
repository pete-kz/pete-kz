import React from "react"
import NavigationBar from "@/components/nav-bar"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"

export default function WebLayout() {
  return (
    <div className="h-screen">
      <NavigationBar />
      <Toaster />
      <div className="p-4 pt-20 flex justify-center">
        <main className="md:max-w-7xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
