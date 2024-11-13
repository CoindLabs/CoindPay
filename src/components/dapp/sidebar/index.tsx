import Link from 'next/link'
import { useRouter } from 'next/router'
import { Avatar, useMediaQuery, useTheme } from '@mui/material'
import classNames from 'classnames'
import NmIcon from '@/components/nm-icon'
import { useStudioContext } from '@/components/context/studio'
import { useGlobalWalletConnect, useUserData } from '@/lib/hooks'

import config from '@/config'

const { prefix, domains, logo } = config

let menus = [
  {
    name: 'Home',
    icon: 'infinity',
    path: '/dashboard',
  },
  {
    name: 'Payments',
    icon: 'payment',
    path: '/pay',
  },
  {
    name: 'Exchange',
    label: 'DEX',
    icon: 'bank',
    path: '/dex',
  },
  {
    name: 'Markets',
    icon: 'markets',
    path: '/markets',
    disabled: true,
  },
  {
    name: 'Profile',
    icon: 'user_outline',
  },
  {
    name: 'More',
    icon: 'more',
    disabled: true,
    class: 'hidden',
    // paths: ['accounts', 'notifications', 'additional'],
    // submenu: [
    //   {
    //     name: 'Credit',
    //     icon: 'card',
    //   },
    //   {
    //     name: 'Contact',
    //     icon: 'contact',
    //   },
    //   {
    //     name: 'Docs',
    //     icon: 'news',
    //   },
    //   {
    //     name: 'Settings',
    //     icon: 'settings',
    //   },
    // ],
  },
]

const SideBar = ({ ...props }) => {
  const theme = useTheme()
  const router = useRouter()
  const user = useUserData()
  const globalWalletConnect = useGlobalWalletConnect()
  const { setAccountCardShow } = useStudioContext()
  let lg2Screen = useMediaQuery(theme.breakpoints.up('lg')),
    smScreen = useMediaQuery(theme.breakpoints.up('sm'))

  const handleMenuClick = (row, e) => {
    let userMenu = row?.name && row.name.toLowerCase().includes('profile')
    if (row?.disabled) return e.preventDefault()
    if (!row?.path) {
      if (userMenu) {
        if (!user?.id || !globalWalletConnect) {
          setAccountCardShow(true)
          e.preventDefault()
        }
      }
    }
  }

  return (
    <aside className="h-fit sticky z-1 top-0 left-0 bottom-4 w-full lg:top-[calc(84px+2.5rem)] order-last lg:w-auto lg:order-first xl:min-w-64">
      <ul className="flex justify-between gap-2 mx-auto max-w-sm sm:max-w-xl max-lg:items-center max-lg:rounded-full max-lg:border max-lg:border-gray-1 max-lg:bg-gray-100/80 backdrop-blur max-lg:px-2 lg:flex-col">
        {menus.map((row, index) => {
          let userMenu = row.name.toLowerCase().includes('profile'),
            routePaths = router?.asPath.split('/').filter(e => e),
            itemActive =
              (row?.path && router?.pathname == row?.path) ||
              (userMenu && router?.asPath.includes(user?.id)) ||
              (row?.['submenu'] && row?.['paths'] && routePaths.find(kk => row?.['paths'].includes(kk))),
            itemIcon = ({ activeClass = null } = {}) => (
              <NmIcon
                type={`icon-${row?.icon}`}
                className={classNames('text-2xl leading-0 lg:group-hover:text-white transition-all', {
                  'text-white text-2.5xl': itemActive,
                  [activeClass]: itemActive,
                })}
              />
            )

          return (
            <li
              key={`sidebar-menu-item-${index}`}
              className={classNames(
                'flex-1 hover:transition-all mt-2.5 mb-1.5 lg:my-3 left-0 right-0 lg:max-xl:tooltip tooltip-right last:tooltip-bottom dropdown dropdown-left sm:dropdown-right dropdown-bottom sm:dropdown-end',
                row?.['class'],
                {
                  'tooltip !tooltip-top opacity-20': row?.disabled,
                }
              )}
              tabIndex={index + 1}
              data-tip={row?.disabled ? 'Upcoming' : row.name}
            >
              <Link
                href={(userMenu ? `/${user?.id}` : row?.path) || ''}
                className={classNames(
                  'group text-zinc-500 max-sm:text-sm flex items-center lg:font-semibold gap-0.5 xl:gap-4 max-lg:flex-col',
                  {
                    'font-medium lg:font-bold': itemActive,
                    'cursor-not-allowed': row?.disabled,
                  }
                )}
                onClick={e => handleMenuClick(row, e)}
              >
                {row?.icon &&
                  (lg2Screen ? (
                    <Avatar
                      className={classNames(
                        'text-current bg-transparent group-hover:bg-create-gradient-004 group-hover:font-extrabold group-hover:transition-all',
                        {
                          'bg-create-gradient-004': itemActive,
                        }
                      )}
                    >
                      {itemIcon()}
                    </Avatar>
                  ) : (
                    itemIcon({ activeClass: '!text-success' })
                  ))}
                <span
                  className={classNames(
                    'font-righteous sm:tracking-wide sm:text-lg lg:max-xl:hidden lg:group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-create-gradient-004',
                    {
                      'text-transparent bg-clip-text bg-create-gradient-004': itemActive,
                    }
                  )}
                >
                  {smScreen ? row.name : row?.label || row.name}
                </span>
              </Link>
              {row?.['submenu'] && row?.['submenu']?.length && (
                <ul
                  tabIndex={index + 1}
                  className="dropdown-content dropdown-hover menu bg-white shadow-sm before:hidden border rounded-box gap-2 w-fit sm:w-50 xl:w-56 ml-2 text-base leading-9 max-sm:top-14 max-sm:right-0 z-100"
                >
                  {row?.['submenu'].map((item, index) => (
                    <li key={`sidebar-submenu-item-${index}`} className={classNames(item?.['class'])}>
                      <Link
                        href={item?.['path'] || ''}
                        className={classNames('flex items-center', {
                          'focus font-bold text-black':
                            item?.['path'] &&
                            row?.['paths'] &&
                            routePaths.find(kk => row?.['paths'].includes(kk)) &&
                            item?.['path']
                              .split('/')
                              .filter(e => e)
                              .find(kk => row?.['paths'].includes(kk)),
                        })}
                        target={item?.['target']}
                      >
                        {item?.icon && (
                          <NmIcon type={`icon-${item?.icon}`} className="text-2xl leading-0 hover:scale-105 mr-3" />
                        )}
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default SideBar
