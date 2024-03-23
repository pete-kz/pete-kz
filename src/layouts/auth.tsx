import React from "react"
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import MobilePageHeader from "@/components/mobile-page-header"
import { useTranslation } from "react-i18next"

export default function AuthLayout() {
  // Setups
  const { t } = useTranslation()

  return (
    <div className='h-screen flex justify-center bg-[url("/images/background.webp")]'>
      <div className="max-w-lg bg-background">
        <MobilePageHeader title={t("header.authorization")} to="/pwa/profile" />
        <Toaster />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
