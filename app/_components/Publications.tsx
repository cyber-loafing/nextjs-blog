import { formatDate } from 'pliny/utils/formatDate'
import Image from 'next/image'
import PublicationList from '@/data/publicationList'


export default function Publications() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-4xl md:leading-14">
            Publications
          </h1>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!PublicationList.length && 'No publications found.'}
          {PublicationList.map((pub) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <div>
                <li key={pub.title} className="py-12">
                  <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={pub.date}>{formatDate(pub.date)}</time>
                        </dd>
                        <Image
                          src={pub.img}
                          alt={pub.title}
                          width={200}
                          height={200}
                        />
                      </dl>
                      <div className="space-y-5 xl:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold leading-8 tracking-tight">
                              {/* 点击时有下划线动画 */}
                              <a
                                href={pub.url}
                                className="text-gray-900 dark:text-gray-100 hover:underline"
                                target='_blank'
                              >
                                {pub.title}
                              </a>
                            </h2>
                            <div className='text-xl text-primary-400'>
                              {pub.publish_in}
                            </div>
                            <div className="flex flex-wrap">
                              {pub.authors.map((author,idx) => (
                                // 如果是pub.bold_idx，就加粗
                                // 如果不是最后一个，就加逗号
                                <span key={author} className={author === "Hanze Jia" ? 'font-bold' : ''}>
                                  {author}
                                  {idx !== pub.authors.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                            {/* pdf 在新标签页面显示*/}
                            <div>
                              <a
                                href={pub.url}
                                className='text-primary-400 underline hover:text-primary-600 mr-3'
                                target='_blank'
                              >
                                Detail
                              </a>
                              <a
                                href={pub.pdf}
                                className='text-primary-400 underline hover:text-primary-600 mr-3'
                                target='_blank'
                              >
                                PDF
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              </div>
            )
          })}
        </ul>
      </div>
    </>
  )
}
