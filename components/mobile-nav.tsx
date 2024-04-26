'use client'

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import headerNavLinks from '@/data/headerNavLinks'

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label="Toggle Menu" className="w-10 px-0 sm:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="fixed mt-8 h-full">
          {headerNavLinks.map((link) => (
            <MobileLink
              key={link.title}
              href={link.href}
              onOpenChange={setOpen}
              className="block px-8 py-4 text-2xl font-semibold text-gray-900 dark:text-gray-100"
            >
              {link.title}
            </MobileLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
  className?: string
}

function MobileLink({ href, onOpenChange, children, className, ...props }: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}
