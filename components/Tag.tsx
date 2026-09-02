import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-200"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
