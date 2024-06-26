import Image from '@/components/Image'
import SocialIcon from '@/components/social-icons'
import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'

export default function AboutMe() {
  const author = allAuthors.find((p) => p.slug === 'mainpage') as Authors
  const mainContent = coreContent(author)
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center space-x-2 py-8">
            <Image
              src="/static/images/jhz.png"
              alt="avatar"
              width={192}
              height={192}
              className="h-48 w-48 rounded-full"
            />
            <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">Hanze Jia 贾涵泽</h3>
            <div className="text-gray-500 dark:text-gray-400">Zhejiang University</div>
            <div className="flex flex-col space-y-3 pt-5">
              <SocialIcon kind="mail" href={`mailto:hzjia1118@gmail.com`} disp='hzjia1118@gmail.com' />
              <SocialIcon kind="github" href="https://github.com/cyber-loafing" disp='Github' />
              <SocialIcon kind="twitter" href="{twitter}" disp='Twitter' />
              <SocialIcon kind="googlescholar" href="{linkedin}" disp='Google Scholar' />
            </div>
          </div>
          <div className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2">
            <MDXLayoutRenderer code={author.body.code} />
          </div>
        </div>
      </div>
    </>
  )
}
