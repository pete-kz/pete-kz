/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, lazy } from "react"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { useTranslation } from "react-i18next"
import { API } from "@config"
import { type Pet_Response, AuthState, User_Response } from "@declarations"
import { axiosAuth as axios } from "@utils"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import ReactImageGallery from "react-image-gallery"
import { formatAge } from "@/lib/utils"
import { OverlayContent, Overlay } from "./ui/overlay"
import BackButton from "./back-button"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import PetOverlayContactSection from "./pet-overlay-contact-section"

const ChangePetForm = lazy(() => import("@/components/forms/change-pet"))
const LikeButton = lazy(() => import("@/components/like-button"))

interface PetOverlayProps {
  pet: Pet_Response
  info?: boolean
  like?: boolean
  edit?: boolean
  contacts?: boolean
  open?: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PetOverlay({
  pet,
  info = false,
  edit = false,
  contacts = false,
  open = false,
  like = false,
  setOpen,
}: PetOverlayProps) {
  // Setups
  const user = useAuthUser<AuthState>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: ownerData } = useQuery<User_Response>({
    queryKey: ["owner", pet._id],
    queryFn: () =>
      axios
        .get(`${API.baseURL}/users/find/${pet.ownerID}`)
        .then((res) => res.data),
    refetchInterval: 2000,
  })

  // States
  const [imageLinks, setImageLinks] = useState<
    { original: string; thumbnail: string }[]
  >([])

  useEffect(() => {
    setImageLinks(
      pet.imagesPath.map((imageLink) => ({
        original: imageLink,
        thumbnail: imageLink,
      })),
    )
  }, [])

  return (
    <Overlay open={open}>
      <OverlayContent className="max-h-full h-fit overflow-scroll">
        {edit && pet.ownerID === user?._id && (
          <div className="m-4 bg-card p-4 border rounded-lg mb-16">
            <BackButton className="p-0" action={() => setOpen(false)} />
            <ChangePetForm setOpen={setOpen} pet_id={pet._id} />
          </div>
        )}

        {ownerData && info && (
          <Card className="border-none rounded-none flex flex-col h-full w-full">
            <BackButton className="pb-0 pl-4" action={() => setOpen(false)} />
            <CardTitle className="p-6 pb-2 pt-2">
              {pet.name},{" "}
              {
                formatAge(
                  pet.birthDate,
                  t("pet.year"),
                  t("pet.month"),
                ) as string
              }
              <br />
              <span
                className="text-muted font-normal"
                onClick={() => navigate("/pwa/users/" + ownerData._id)}
              >
                {ownerData.companyName
                  ? ownerData.companyName
                  : ownerData.firstName + " " + ownerData.lastName}
              </span>
            </CardTitle>
            <CardContent className="p-0">
              <ReactImageGallery
                items={imageLinks}
                showFullscreenButton={false}
                showThumbnails={true}
                showPlayButton={false}
              />
            </CardContent>
            <div className="p-6 pt-2 pb-2">
              <div id="pet_table">
                <div id="pet_row">
                  <p>{t("pet.sex.default")}</p>
                  <p>{t(`pet.sex.${pet.sex}`)}</p>
                </div>
                <div id="pet_row">
                  <p>{t("pet.sterilized")}</p>
                  <p>{pet.sterilized ? t("label.yes") : t("label.no")}</p>
                </div>
                <div id="pet_row">
                  <p>{t("pet.weight")}</p>
                  <p>{`${pet.weight} ${t("pet.kg")}`}</p>
                </div>
              </div>
              <pre className="font-normal font-sans p-3 bg-border rounded-lg mt-3 mb-0">
                {pet.description}
              </pre>
            </div>
            {contacts && (
              <div className="p-6 pt-0">
                <PetOverlayContactSection user={ownerData} />
              </div>
            )}
          </Card>
        )}

        {like && <LikeButton pet={pet} />}
      </OverlayContent>
    </Overlay>
  )
}
