import React from "react"
import { Card, CardContent, CardTitle } from "../ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { useToast } from "../ui/use-toast"

export default function SupportCard() {
  // Setups
  const { t } = useTranslation()
  const { toast } = useToast()

  function copyToClipboard(text: string) {
    return () => {
      navigator.clipboard.writeText(text)
      toast({ description: t("label.copied") })
    }
  }

  return (
    <Card className="p-4">
      <CardTitle>{t("label.support.default")}</CardTitle>
      <CardContent className="mt-2 p-0">
        <p className="italic">{`(${t("label.support.ten")})`}</p>
        <p>{t("label.support.usVia")}</p>
        <ul className="list-disc ml-5">
          <li>
            Kaspi Gold {"->"}{" "}
            <Button
              className="p-0"
              variant={"link"}
              onClick={copyToClipboard("4400430228103260")}
            >
              4400 4302 2810 3260
            </Button>
          </li>
          <li>
            Halyk Visa {"->"}{" "}
            <Button
              className="p-0"
              variant={"link"}
              onClick={copyToClipboard("4405639703506988")}
            >
              4405 6397 0350 6988
            </Button>
          </li>
          <li>
            Paypal {"->"}{" "}
            <Button
              className="p-0"
              variant={"link"}
              onClick={copyToClipboard("artyom.chshyogolev@gmail.com")}
            >
              artyom.chshyogolev@gmail.com
            </Button>
          </li>
        </ul>
        <p className="italic">{`${t("label.support.note")}`}</p>
      </CardContent>
    </Card>
  )
}
