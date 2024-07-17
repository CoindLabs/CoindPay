import React, { useState, memo, useRef, useEffect } from 'react'
import { Box, Button, ClickAwayListener, Grow, IconButton, Link, Paper, Popper, Typography } from '@mui/material'
import { useEnsName } from 'wagmi'
import classNames from 'classnames'
import NmIcon from '@/components/nm-icon'
import Skus from '@/components/dapp/landing/skus'
import { useSnackbar } from '@/components/context/snackbar'
import { capitalizeFirstLetter, getNFTOrScanUrl, getShortenMidDots } from '@/lib/utils'
import { useAppDispatch, useIsLoggedIn } from '@/lib/hooks'
import { getUserAccountSvc } from '@/services/user'
import { setUserInfo } from '@/store/slice/user'

const BlockUserInfo = ({ payee, user, ...props }) => {
  const dispatch = useAppDispatch()

  const isLoggedIn = useIsLoggedIn({ id: user?.id })

  const [nickname, setNickName] = useState(user?.nickname || '')
  const [bio, setBio] = useState(user?.bio || '')

  const [nicknameEditing, setNicknameEditing] = useState(false)
  const [bioEditing, setBioEditing] = useState(false)

  const [profileEdited, setProfileEdited] = useState(false)
  const [loading, setLoading] = useState(false)

  const textAreaRef = useRef(null)

  const { bg = {} } = Skus[`S00${payee?.style?.theme || 0}`]
  const { showSnackbar } = useSnackbar()

  let { addressList } = user
  let { data: ensName } = useEnsName({ address: addressList?.find(row => row?.chain == 'evm')?.value }),
    domainName = ensName || ''

  let addressDefault = addressList?.length > 0 && addressList[0],
    shortenDotAddress = getShortenMidDots(addressDefault?.value)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [addressHub, setAddressHub] = useState({
    open: false,
  })
  const [addressIcon, setAddressIcon] = useState(addressList?.length > 1 ? 'icon-arrow_down' : 'icon-copy_outline')

  const scan_url = getNFTOrScanUrl({
    type: 'address',
    address: addressDefault?.value,
    chainType: addressDefault?.type,
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

  useEffect(() => {
    if (bioEditing && textAreaRef.current) {
      const textarea = textAreaRef.current
      textarea.focus()
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    }
  }, [bioEditing])

  const contentTitle = (
    <Box className="text-4xl max-w-md leading-normal">
      {isLoggedIn && nicknameEditing ? (
        <input
          type="text"
          autoFocus
          className="rounded-md placeholder:text-neutral-400 pl-0 border-0 outline-0 focus:ring-0 w-full bg-transparent truncate text-4xl"
          placeholder="Name"
          defaultValue={nickname || user?.nickname}
          disabled={!isLoggedIn}
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
          className={classNames('cursor-pointer py-px truncate', {
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
    <Box className="pb-1.5 text-neutral-400 line-clamp-5 whitespace-pre-wrap break-words">
      {isLoggedIn && bioEditing ? (
        <textarea
          rows={5}
          ref={textAreaRef}
          className="animate__animated animate__fadeIn resize-none outline-0 p-2 rounded-md border-neutral-800 focus:ring-0 w-full bg-transparent truncate text-neutral-700 whitespace-pre-wrap break-words"
          placeholder="Add some bio..."
          defaultValue={bio || user?.bio}
          disabled={!isLoggedIn}
          onChange={e => {
            setBio(e.target.value)
            setProfileEdited(
              (e.target.value && e.target.value !== user?.bio) || Boolean(nickname) !== Boolean(user?.nickname)
            )
          }}
          onBlur={() => handleProfileBlur('bio')}
        />
      ) : (
        <p className="cursor-pointer" onClick={() => setBioEditing(true)}>
          {bio || user?.bio || 'Add some bio...'}
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
            'max-lg:justify-center': !isLoggedIn,
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
                'rotate-180': addressHub.open,
              }
            )}
            onClick={event =>
              addressList?.length > 1
                ? handleEventAction({ type: 'hub', event, toast: false })
                : handleEventAction({ type: 'address' })
            }
          />
        </Box>
        <Popper id="address-hub" open={addressHub.open} anchorEl={anchorEl} transition disablePortal placement="bottom">
          {({ TransitionProps, placement }) => {
            return (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'top' : 'bottom',
                }}
              >
                <Paper
                  className={classNames(
                    'mt-1.5 rounded-xl backdrop-blur border border-neutral-600',
                    bg?.blur?.includes('backdrop') ? 'bg-black/95' : 'bg-black/70'
                  )}
                >
                  <ClickAwayListener onClickAway={() => setAddressHub({ open: false })}>
                    <ul className="menu px-0">
                      {addressList.map(row => (
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
                              chainType: row?.chain,
                            })}
                          >
                            <NmIcon
                              type={`icon-${row?.chain == 'sol' ? 'solana' : 'evm'}`}
                              className="leading-0 mr-1 text-1.5xl hover:scale-110 transition-all"
                            />
                            {getShortenMidDots(row?.value, 6)}
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
    </article>
  )
}

export default memo(BlockUserInfo)
