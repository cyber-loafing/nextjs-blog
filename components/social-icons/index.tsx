import {
  Mail,
  Github,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Mastodon,
  Threads,
  Instagram,
  GoogleScholar
} from './icons'

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  mastodon: Mastodon,
  threads: Threads,
  instagram: Instagram,
  googlescholar: GoogleScholar
}

type SocialIconProps = {
  kind: keyof typeof components
  href: string | undefined
  size?: number
  disp?: string
}

const SocialIcon = ({ kind, href, size = 6, disp = "" }: SocialIconProps) => {
  if (!href || (kind === 'mail' && !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href)))
    return null

  const SocialSvg = components[kind]

  return (
    <a
      className="text-sm text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      {/* 图标与描述在一行显示 */}
      <div className="flex items-center space-x-4">
        <SocialSvg
          className={`fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 h-${size} w-${size}`}
        />
        <span>{disp}</span>
      </div>

    </a>
  )
}

export default SocialIcon
