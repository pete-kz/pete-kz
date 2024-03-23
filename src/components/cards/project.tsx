import React from "react"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import { Github, Instagram } from "lucide-react"

export default function ProjectCard({
  description = false,
  social = false,
}: {
  description?: boolean
  social?: boolean
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <img loading="lazy" src="/images/pete-logo.svg" width={30} />
      <p className="text-2xl font-semibold">Pete</p>
      {social && (
        <div className="flex gap-2">
          <Button
            variant={"link"}
            className="text-white/75 hover:bg-none hover:text-[#c18dbf] transition-all ease-in duration-75 p-0 gap-2 hover:no-underline"
            onClick={() => navigate("https://github.com/pete-kz")}
          >
            Github <Github />
          </Button>
          <Button
            variant={"link"}
            className="text-white/75 hover:bg-none hover:text-[#c18dbf] transition-all ease-in duration-75 p-0 gap-2 hover:no-underline"
            onClick={() => navigate("https://instagram.com/pete.kazakhstan")}
          >
            Instagram <Instagram />
          </Button>
        </div>
      )}
      {description && (
        <p className="text-muted-foreground">{t("label.slogan")}</p>
      )}
    </div>
  )
}
