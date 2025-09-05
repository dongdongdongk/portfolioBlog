import 'css/blog.css'
import 'highlight.js/styles/github-dark.css'

import PageTitle from '@/components/PageTitle'
import { getAllPosts, getPostBySlug, getPostHtml } from '@/lib/mdx'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  
  try {
    const post = getPostBySlug('blog', slug)
    if (!post) {
      return
    }

    const publishedAt = new Date(post.date).toISOString()
    const modifiedAt = new Date(post.lastmod || post.date).toISOString()
    
    return {
      title: post.title,
      description: post.summary,
      openGraph: {
        title: post.title,
        description: post.summary,
        siteName: siteMetadata.title,
        locale: 'en_US',
        type: 'article',
        publishedTime: publishedAt,
        modifiedTime: modifiedAt,
        url: './',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.summary,
      },
    }
  } catch {
    return
  }
}

export const generateStaticParams = async () => {
  const posts = getAllPosts('blog')
  return posts.map((p) => ({ slug: [p.slug] }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  
  try {
    const post = getPostBySlug('blog', slug)
    if (!post) {
      return notFound()
    }

    const allPosts = getAllPosts('blog')
    const postIndex = allPosts.findIndex((p) => p.slug === slug)
    const prev = allPosts[postIndex + 1] || null
    const next = allPosts[postIndex - 1] || null

    // HTML로 변환된 마크다운 콘텐츠
    const htmlContent = getPostHtml('blog', slug)
    
    const Layout = layouts[post.layout || defaultLayout]

    // 간단한 content 객체 생성 (기존 레이아웃 호환용)
    const mainContent = {
      title: post.title,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      slug: post.slug,
      path: `/blog/${post.slug}`,
      filePath: `data/blog/${post.slug}.md`
    }

    return (
      <Layout content={mainContent} authorDetails={[]} next={next} prev={prev}>
        <div 
          className="blog-content"
          style={{ 
            textAlign: 'left', 
            maxWidth: 'none',
            fontSize: '1.125rem',
            lineHeight: '1.75'
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </Layout>
    )
  } catch (error) {
    return notFound()
  }
}
