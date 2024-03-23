import React from "react"
import ReactImageGallery from "react-image-gallery"
import { main } from "@config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HowToInstall() {
  return (
    <Tabs defaultValue="IOS">
      <TabsList aria-label="PWA Instructions">
        <TabsTrigger value="IOS">IOS</TabsTrigger>
        <TabsTrigger value="ANDROID">Android</TabsTrigger>
      </TabsList>
      <TabsContent value="IOS">
        <ReactImageGallery
          showPlayButton={false}
          showThumbnails={false}
          autoPlay={false}
          showFullscreenButton={false}
          items={main.howToInstallPictures.IOS}
        />
      </TabsContent>
      <TabsContent value="ANDROID">Android</TabsContent>
    </Tabs>
  )
}
