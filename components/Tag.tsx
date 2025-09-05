import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="mr-2 mb-2 inline-flex transform items-center rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:scale-105 hover:bg-slate-700/50 hover:text-white"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
