import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="inline-flex items-center px-3 py-1.5 bg-slate-800/50 border border-slate-700 text-gray-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-all duration-300 transform hover:scale-105 mr-2 mb-2 text-sm font-medium"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
