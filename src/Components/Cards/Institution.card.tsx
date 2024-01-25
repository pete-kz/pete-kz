/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { red, yellow, green, grey } from '@mui/material/colors'
import { Avatar, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slider, TextField, Divider, ListItemText, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { InsertLinkOutlined, StarOutlined, Diversity1, WarningAmber, Dangerous, CommentOutlined } from '@mui/icons-material'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { themeColor } from '@colors'
import type { UserComments_Props, Comments_Props, Comment_Props, InstitutionCard_Props } from '@declarations'
import { API } from '@config'
import { axiosAuth as axios, notification } from '@utils'
import { AxiosResponse } from 'axios'

function UserComments({ userID, rate, comment }: UserComments_Props) {
  // States
  const [user, setUser] = useState<string>('')

  // Functions
  function getUser() {
    const query = { query: { _id: userID } }
    axios.post(`${API.baseURL}/users/find`, query).then((response: AxiosResponse) => {
      if (!response.data.err) {
        setUser(response.data.login!)
      } else {
        notification.custom.error(response.data.err)
      }
    })
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <>
      <div className="flex">
        <ListItemText
          primary={`${user} - ${rate}`}
          secondary={comment}
        />
      </div>
      <Divider />
    </>
  )
}

function Comments({ comments, id }: Comments_Props) {
  return (
    <div style={{ width: '100%', maxWidth: '500px', overflowY: 'scroll' }} className="h-full">
      {comments.map(({
        rate, userID, institutionID, content, _id,
      }) => (
        institutionID === id && <UserComments key={_id} userID={userID} rate={rate} comment={content} />
      ))}
      <div className="mt-3" style={{ height: 1, width: 1 }} />
    </div>
  )
}

export default function InstitutionCard({ userID, id, name, address, status, description, link, imagePath, city, }: InstitutionCard_Props) {

  // Setups
  const style = { display: 'none', zIndex: 500, backgroundColor: 'rgb(0,0,0,0.5)' }

  // States
  const [openRateDialog, setRateDialogOpen] = useState<boolean>(false)
  const [showRate, setShowRate] = useState<string>('')
  const [showRateColor, setShowRateColor] = useState<string>('')
  const [comments, setComments] = useState<Comment_Props[]>([])
  const [loadingRate, setLoadingRate] = useState<boolean>(false)
  const [rate, setRate] = useState<number>(5)
  const [commentContent, setCommentContent] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [rerender, setRerender] = useState<number>(1)
  const [showComments, setShowComments] = useState<boolean>(false)
  const { t } = useTranslation()
  const [classesShowComments, classesSetShowComments] = useState<string>('fixed top-0 bottom-0 left-0 right-0 border-none animate__animated animate__fadeIn')
  const [classesBottomSheet, classesSetBottomSheet] = useState<string>('relative flex flex-col items-center h-full w-full animate__animated animate__slideInUp')

  // Handlers
  const handleRateChange = (event: Event) => {
    const element = event.target as HTMLInputElement
    setRate(parseInt(element.value, 10))
  }
  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(event.target.value)
  }

  if (showComments) {
    style.display = 'block'
  } else {
    style.display = 'none'
  }

  if (userID == null) {
    localStorage.removeItem('token')
    location.reload()
  }

  // Functions
  function ReRender() {
    setRerender(rerender + 1)
  }

  function addRate() {
    setLoadingRate(true)
    if (commentContent != '') {
      axios.post(`${API.baseURL}/comments/add`, {
        userID,
        institutionID: id,
        content: commentContent,
        rate,
      }).then((response: AxiosResponse) => {
        if (!response.data.err) {
          setRateDialogOpen(false)
          setLoadingRate(false)
          notification.custom.success(t('main.institution_card.rate_dialog.rate_successfully_added'))
          ReRender()
        } else {
          notification.custom.error(response.data.err)
        }
      })
    } else {
      setError(true)
      setLoadingRate(false)
    }
  }

  function getComments() {
    axios.post(`${API.baseURL}/comments/get`, {
      query: {
        institutionID: id,
      },
    }).then((response: AxiosResponse) => {
      if (!response.data.err) {
        const data = response.data
        setComments(data)
        let sumRate = 0
        let n = 0
        for (let i = 0; i < data.length; i += 1) {
          const rate1 = data[i].rate
          sumRate += parseInt(rate1, 10)
          n += 1
        }
        let average = (Math.ceil((sumRate / n) * 10)) / 10
        if (average < 0 || average === 0) {
          average = 5
        }
        if (average >= 8) {
          setShowRate(average.toString())
          setShowRateColor(green[800])
        } else if (average >= 6) {
          setShowRate(average.toString())
          setShowRateColor(green[400])
        } else if (average >= 4) {
          setShowRate(average.toString())
          setShowRateColor(yellow[800])
        } else if (average >= 2) {
          setShowRate(average.toString())
          setShowRateColor(red[300])
        } else if (average >= 0) {
          setShowRate(average.toString())
          setShowRateColor(red[800])
        } else {
          setShowRate('X')
          setShowRateColor(grey[50])
        }
      } else {
        notification.custom.error(response.data.err)
      }
    })
  }

  function handleCommentsClose() {
    setTimeout(() => {
      setShowComments(false)
      classesSetShowComments('fixed top-0 bottom-0 left-0 right-0 border-none animate__animated animate__fadeIn')
      classesSetBottomSheet('relative flex flex-col items-center h-full w-full animate__animated animate__slideInUp')
    }, 1000)
    classesSetShowComments('fixed top-0 bottom-0 left-0 right-0 border-none animate__animated animate__fadeOut')
    classesSetBottomSheet('relative flex flex-col items-center h-full w-full animate__animated animate__slideOutDown')
  }

  // Marks for slider
  const marks: Array<{ value: number, label: JSX.Element }> = [
    {
      value: 0,
      label: <Dangerous sx={{ color: red[500] }} />,
    },
    {
      value: 5,
      label: <WarningAmber sx={{ color: yellow[400] }} />,
    },
    {
      value: 10,
      label: <Diversity1 sx={{ color: green[300] }} />,
    },
  ]

  useEffect(() => {
    getComments()
  }, [rerender])



  return (
    <>
      <m.div key={`${id}`} className="my-1 mx-2 rounded-2xl w-full" style={{ backgroundColor: themeColor[2], maxWidth: '500px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-start flex-row items-center p-4 pb-0">
          <div className="flex rounded-full">
            <Avatar sx={{ bgcolor: showRateColor }}>{showRate}</Avatar>
          </div>
          <div className="flex flex-col ml-4">
            <h4 className="" style={{ color: themeColor[11] }}>{name}</h4>
            <p style={{ color: themeColor[11] }}>{status[1]}</p>
          </div>
        </div>
        {imagePath !== undefined && imagePath !== ''
          && (
            <div className="pt-2 mt-2 mb-2">
              <div className="flex justify-center ">
                <img src={imagePath} alt="" className="min-w-full" style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden' }} />
              </div>
            </div>
          )}
        <div className="mt-4 px-4 ">
          <Typography variant="body2" color="text.secondary">
            {t('main.institution_card.address_label')}
            :
            {city}
            ,
            {address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </div>
        <div className="flex justify-between mt-7 flex-row px-4 pb-4">
          <div className="flex flex-row">
            <IconButton
              sx={{
                borderColor: themeColor[12], color: themeColor[7], borderRadius: 9999, fontWeight: 500, paddingLeft: '12px', paddingRight: '12px', marginRight: 1, border: 1,
              }}
              onClick={() => { setRateDialogOpen(true) }}
            >
              <StarOutlined />
              {' '}
              <p className="text-sm ml-2 mr-2">{t('main.institution_card.rate_button')}</p>
            </IconButton>
            <IconButton
              sx={{
                borderColor: themeColor[12], color: themeColor[7], borderRadius: 9999, fontWeight: 500, paddingLeft: '12px', paddingRight: '12px', border: 1,
              }}
              onClick={() => { window.open(link, '_blank') }}
            >
              <InsertLinkOutlined />
              {' '}
              <p className="text-sm ml-2 mr-2">{t('main.institution_card.link_button')}</p>
            </IconButton>
          </div>
          <div>
            <IconButton onClick={() => { setShowComments(true) }}>
              <CommentOutlined />
            </IconButton>
          </div>
        </div>
      </m.div>
      {showComments
        && (
          <div className={classesShowComments} style={style}>
            <div className={classesBottomSheet}>
              <div onClick={handleCommentsClose} className="h-1/3 w-full" />
              <div style={{ backgroundColor: themeColor[2], zIndex: 1000 }} className="h-2/3 absolute bottom-0 w-11/12 p-4 rounded-t-2xl">
                <h1 className="text-xl">{t('main.institution_card.comments_label')}</h1>
                <Comments comments={comments} id={id} />
              </div>
            </div>
          </div>
        )}
      <Dialog open={openRateDialog} onClose={() => { setRateDialogOpen(false) }} className="animate__animated animate__fadeIn">
        <DialogTitle>{t('main.institution_card.rate_dialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('main.institution_card.rate_dialog.content_text.0')}
          </DialogContentText>
          <Slider aria-label="Always visible" defaultValue={5} onChange={handleRateChange} step={1} marks={marks} valueLabelDisplay="on" min={0} max={10} />
          <DialogContentText sx={{ marginBottom: 1 }}>
            {t('main.institution_card.rate_dialog.content_text.1')}
          </DialogContentText>
          <TextField error={error} variant="outlined" multiline fullWidth minRows={3} onChange={handleCommentChange} onClick={() => { setError(false) }} required />
        </DialogContent>
        <DialogActions sx={{ marginRight: 2, marginBottom: 2, bgColor: themeColor[2] }}>
          <LoadingButton
            variant="outlined"
            loading={loadingRate}
            onClick={() => { setLoadingRate(true); addRate() }}
            sx={{
              borderColor: themeColor[12], color: themeColor[7], borderRadius: 9999, fontWeight: 500, paddingLeft: '12px', paddingRight: '12px',
            }}
          >
            {t('main.institution_card.rate_dialog.action_button')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
