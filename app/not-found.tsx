import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-32 sm:px-8 lg:px-12">
        <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase">404</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">페이지를 찾을 수 없습니다</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="mt-8 flex h-10 items-center rounded-full border-2 border-slate-900 px-6 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
