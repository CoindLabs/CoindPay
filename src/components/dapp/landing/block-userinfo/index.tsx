import React, { useState, memo, useRef, useEffect } from 'react'
import { Box, Link, Button, ClickAwayListener, Grow, IconButton, Paper, Popper, Typography } from '@mui/material'
import Image from 'next/image'
import { useEnsName } from 'wagmi'
import classNames from 'classnames'
import NmIcon from '@/components/nm-icon'
import { useSnackbar } from '@/components/context/snackbar'
import { capitalizeFirstLetter, getNFTOrScanUrl, getShortenMidDots } from '@/lib/utils'
import { useAppDispatch, useLocation } from '@/lib/hooks'
import { getUserAccountSvc } from '@/services/user'
import { setUserInfo } from '@/store/slice/user'
import { logoChains } from '@/lib/chains'

const BlockUserInfo = ({ payee, user, ...props }) => {
  const host = useLocation('host')

  const dispatch = useAppDispatch()

  const { isInProfile } = user
  const [nickname, setNickName] = useState(user?.nickname || '')
  const [bio, setBio] = useState(user?.bio || '')

  const [nicknameEditing, setNicknameEditing] = useState(false)
  const [bioEditing, setBioEditing] = useState(false)

  const [profileEdited, setProfileEdited] = useState(false)
  const [loading, setLoading] = useState(false)

  const textAreaRef = useRef(null)

  const { showSnackbar } = useSnackbar()

  let { data: ensName } = useEnsName({ address: user?.addressList?.find(row => row?.chain == 'evm')?.value }),
    domainName = ensName || ''

  let addressDefault = user?.addressList?.length > 0 && user?.addressList[0],
    shortenDotAddress = getShortenMidDots(addressDefault?.value)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [addressHub, setAddressHub] = useState({
    open: false,
  })

  const [addressIcon, setAddressIcon] = useState(
    user?.addressList?.length > 1 ? 'icon-arrow_down' : 'icon-copy_outline'
  )

  const scan_url = getNFTOrScanUrl({
    type: 'address',
    address: addressDefault?.value,
    chainType: addressDefault?.chain == 'sol' ? 'svm' : addressDefault?.chain,
  })

  const handleEventAction = ({ type = 'address', address = null, label = null, event = null, toast = true }) => {
    switch (type) {
      case 'hub':
        setAnchorEl(event.currentTarget)
        setAddressHub({ open: !addressHub.open })
        break
      case 'address':
        navigator.clipboard.writeText(address || addressDefault?.value)
        if (!address) {
          setAddressIcon('icon-tick')
          setTimeout(() => {
            setAddressIcon('icon-copy_outline')
          }, 2000)
        }
      default:
        break
    }
    toast &&
      showSnackbar({
        snackbar: {
          open: true,
          type: 'success',
          text: `${capitalizeFirstLetter(label || type)} copy success ᵔ◡ᵔ`,
        },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      })
  }

  const handleProfileBlur = (type = 'nickname') => {
    if (nickname !== (user?.nickname ?? '') || bio !== (user?.bio ?? '')) {
      setProfileEdited(true)
    } else {
      setProfileEdited(false)
    }
    switch (type) {
      case 'nickname':
        setNicknameEditing(false)
        break
      case 'bio':
        setBioEditing(false)
        break

      default:
        break
    }
  }

  const handleUpdateAccount = async () => {
    setLoading(true)
    let res = await getUserAccountSvc({
      id: user?.id,
      nickname,
      bio,
    })
    if (res?.ok) {
      dispatch(
        setUserInfo({
          ...res?.data,
        })
      )
      setProfileEdited(false)
      showSnackbar({
        snackbar: {
          open: true,
          type: 'success',
          text: 'Account updated success ᵔ◡ᵔ',
        },
      })
    }
    setLoading(false)
  }

  const handleCopyPayeeURL = () => {
    navigator.clipboard.writeText(`${origin}/${user?.id}`)
    showSnackbar({
      snackbar: {
        open: true,
        type: 'success',
        text: 'Payments profile copy success ᵔ◡ᵔ',
      },
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
    })
  }

  useEffect(() => {
    setNickName(user?.nickname || '')
    setBio(user?.bio || '')
  }, [user])

  useEffect(() => {
    if (bioEditing && textAreaRef.current) {
      const textarea = textAreaRef.current
      textarea.focus()
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    }
  }, [bioEditing])

  useEffect(() => {
    setAddressIcon(user?.addressList?.length > 1 ? 'icon-arrow_down' : 'icon-copy_outline')
  }, [user?.addressList])

  const contentTitle = (
    <Box
      className={classNames('font-semibold py-1 text-4xl leading-normal', {
        'max-w-md': isInProfile,
      })}
    >
      {isInProfile && nicknameEditing ? (
        <input
          type="text"
          autoFocus
          className="rounded-md placeholder:text-neutral-400 pl-0 border-0 outline-0 focus:ring-0 w-full bg-transparent truncate text-4xl"
          placeholder="Name"
          defaultValue={nickname || user?.nickname}
          disabled={!isInProfile}
          onChange={e => {
            setNickName(e.target.value)
            setProfileEdited(
              (e.target.value && e.target.value !== user?.nickname) || Boolean(bio) !== Boolean(user?.bio)
            )
          }}
          onBlur={() => handleProfileBlur('nickname')}
        />
      ) : (
        <h1
          className={classNames('cursor-pointer py-px', {
            'text-neutral-400': !(nickname || user?.nickname),
          })}
          onClick={() => setNicknameEditing(true)}
        >
          {nickname || user?.nickname || 'Name'}
        </h1>
      )}
    </Box>
  )

  const contentDesc = (
    <Box className="mb-2 text-neutral-400 line-clamp-5 whitespace-pre-wrap break-words">
      {isInProfile && bioEditing ? (
        <textarea
          rows={5}
          ref={textAreaRef}
          className="animate__animated animate__fadeIn resize-none outline-0 p-2 rounded-md border-neutral-800 focus:ring-0 w-full bg-transparent truncate text-neutral-700 whitespace-pre-wrap break-words"
          placeholder="Add some bio..."
          defaultValue={bio || user?.bio}
          disabled={!isInProfile}
          onChange={e => {
            setBio(e.target.value)
            setProfileEdited(
              (e.target.value && e.target.value !== user?.bio) || Boolean(nickname) !== Boolean(user?.nickname)
            )
          }}
          onBlur={() => handleProfileBlur('bio')}
        />
      ) : (
        <p className="cursor-pointer break-word" onClick={() => setBioEditing(true)}>
          {bio || user?.bio || 'No bio yet...'}
        </p>
      )}
    </Box>
  )

  const contentAddress = ({
    address = null,
    classes = null,
    domainClass = null,
    addressClass = null,
    copyClass = null,
    addressTextClass = null,
  } = {}) =>
    (address || shortenDotAddress) && (
      <Box
        className={classNames(
          'text-neutral-600 flex flex-wrap items-center relative z-1',
          {
            'max-lg:justify-center': !isInProfile,
          },
          classes
        )}
      >
        {domainName && (
          <Link
            href={scan_url}
            target="_blank"
            underline="none"
            rel="noopener noreferrer nofollow"
            className={classNames('text-inherit hover:opacity-90', domainClass)}
          >
            {`@${domainName}`}
          </Link>
        )}
        {domainName && '｜'}
        <Box className="flex items-center">
          <Link
            href={scan_url}
            target="_blank"
            underline="none"
            rel="noopener noreferrer nofollow"
            className={classNames('text-inherit', addressClass, addressTextClass)}
          >
            {shortenDotAddress}
          </Link>
          <NmIcon
            aria-describedby="address-hub"
            type={addressIcon}
            className={classNames(
              'text-base transition-all font-semibold ml-2 mt-0.5 leading-0 cursor-pointer',
              copyClass,
              addressTextClass,
              {
                'rotate-90': addressHub.open,
              }
            )}
            onClick={event =>
              user?.addressList?.length > 1
                ? handleEventAction({ type: 'hub', event, toast: false })
                : handleEventAction({ type: 'address' })
            }
          />
        </Box>
        <Popper
          id="address-hub"
          open={addressHub.open}
          anchorEl={anchorEl}
          transition
          disablePortal
          placement="right"
          className="z-100"
        >
          {({ TransitionProps, placement }) => {
            return (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'top' : 'bottom',
                }}
              >
                <Paper
                  className={classNames('z-100 mt-1.5 rounded-xl backdrop-blur bg-black/70 border border-neutral-600')}
                >
                  <ClickAwayListener onClickAway={() => setAddressHub({ open: false })}>
                    <ul className="menu px-0 z-100">
                      {user?.addressList.map(row => (
                        <li
                          className="flex flex-row flex-nowrap justify-between items-center leading-8"
                          key={`${row?.value}`}
                        >
                          <Link
                            target="_blank"
                            underline="none"
                            rel="noopener noreferrer nofollow"
                            className="text-white focus:opacity-80"
                            href={getNFTOrScanUrl({
                              type: 'address',
                              address: row?.value,
                              chainType: row?.chain == 'sol' ? 'svm' : row?.chain,
                            })}
                          >
                            {row?.chain == 'icp' ? (
                              <Image alt="" width={24} height={24} src={logoChains.icp} className="mr-0.5" />
                            ) : (
                              <NmIcon
                                type={`icon-${(['sol', 'svm'].includes(row?.chain) && 'solana') || (row?.chain == 'evm' && 'evm') || 'more_colors'}`}
                                className="leading-0 mr-1 text-1.5xl hover:scale-110 transition-all"
                              />
                            )}
                            {getShortenMidDots(row?.value, row?.chain == 'icp' ? 8 : 6)}
                          </Link>
                          <NmIcon
                            className="text-white hover:opacity-80 px-3"
                            type="icon-copy_outline"
                            onClick={() => handleEventAction({ type: 'address', address: row?.value })}
                          />
                        </li>
                      ))}
                    </ul>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )
          }}
        </Popper>
      </Box>
    )

  const contentUsername = (
    <Box
      className={classNames('mt-2 p-2 text-sm flex justify-between items-center bg-neutral-100/70 rounded-md', {
        'max-sm:absolute max-sm:mt-5 left-0 w-full': isInProfile,
      })}
    >
      <Link
        className="select-all sm:tracking-wide truncate text-neutral-600"
        href={isInProfile ? `/${user?.id}?newtab=1` : undefined}
        target="_blank"
        underline="none"
        rel="noopener noreferrer nofollow"
      >{`${host}/${user?.id}`}</Link>
      <Button
        size="small"
        color="success"
        variant="contained"
        data-tip="Upcoming"
        className={classNames('px-2 bg-create-gradient-004 rounded-md shadow-none', {
          tooltip: isInProfile,
        })}
        onClick={handleCopyPayeeURL}
      >
        {isInProfile ? 'Claim ID' : 'Copy'}
      </Button>
    </Box>
  )

  return (
    <article className={props?.customClass}>
      {profileEdited && (
        <header className="absolute right-0 -top-6 xl:top-0">
          <Button
            size="small"
            color="success"
            variant="contained"
            className="px-3 bg-create-gradient-004 rounded-md shadow-none"
            endIcon={
              <NmIcon
                type={`icon-${loading ? 'spin' : 'tick'}`}
                className={classNames('text-base leading-0', loading ? 'animate-spin' : 'scale-85')}
              />
            }
            onClick={handleUpdateAccount}
            disabled={loading}
          >
            {loading ? 'Submit' : 'Update'}
          </Button>
        </header>
      )}
      {contentTitle}
      {contentDesc}
      {contentAddress()}
      {contentUsername}
    </article>
  )
}

export default memo(BlockUserInfo)
