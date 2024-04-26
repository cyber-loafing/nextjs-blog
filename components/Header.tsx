'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo_dark from '@/data/logo_dark.svg'
import Logo_light from '@/data/logo_light.svg'
import Link from './Link'
import MobileNav from './mobile-nav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { useState, useEffect } from 'react'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'

const threshold = 10
const Header = () => {
  const scrolled = useScrollTop(threshold)
  return (
    <header
      className={cn(
        'sticky  top-0 z-10 mx-auto flex w-full items-center justify-between py-4 backdrop-blur sm:px-7 xl:px-14',
        scrolled && 'border-b border-gray-200 dark:border-gray-700'
      )}
    >
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mx-3 dark:hidden">
              <Logo_light />
            </div>
            <div className="mx-3 hidden dark:block">
              <Logo_dark />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hidden font-medium text-gray-900 dark:text-gray-100 sm:block"
            >
              {link.title}
            </Link>
          ))}
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
