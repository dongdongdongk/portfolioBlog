'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <h1 className="text-3xl font-bold text-slate-900">Contact</h1>
          <p className="mt-1 text-sm text-slate-400">문의, 협업 제안은 언제든 환영합니다.</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left: Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="이름"
                className="w-full border border-gray-300 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 transition-colors outline-none focus:border-slate-900"
              />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일"
                className="w-full border border-gray-300 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 transition-colors outline-none focus:border-slate-900"
              />
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="제목"
                className="w-full border border-gray-300 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 transition-colors outline-none focus:border-slate-900"
              />
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="문의 내용을 입력해주세요"
                className="w-full resize-none border border-gray-300 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 transition-colors outline-none focus:border-slate-900"
              />

              {submitStatus === 'success' && (
                <p className="text-sm text-green-600">
                  메시지가 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-sm text-red-500">
                  전송 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? '전송 중...' : 'Get In Touch'}
                </button>

                {/* Social icons */}
                <a
                  href="mailto:dhk9309@gmail.com"
                  className="flex h-10 w-10 items-center justify-center border border-gray-300 text-slate-600 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                  aria-label="이메일"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
                <a
                  href="https://github.com/dongdongdongk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-gray-300 text-slate-600 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                  aria-label="GitHub"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
                  </svg>
                </a>
              </div>
            </form>
          </div>

          {/* Right: Text */}
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-4xl leading-tight font-extrabold text-slate-900 sm:text-5xl">
              당신의{' '}
              <span className="inline-block border-2 border-slate-900 px-2 font-extrabold">
                아이디어
              </span>
              를<br />
              들려주세요
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-slate-500">
              게임 오디오, 사운드 디자인, 풀스택 개발 등 어떤 분야든 환영합니다. 협업 제안이나
              프로젝트 문의가 있으시면 편하게 연락해주세요.
            </p>
            <div className="space-y-2">
              <p className="text-base font-bold text-slate-900">dhk9309@gmail.com</p>
              <p className="text-base font-bold text-slate-900">010-8005-5113</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
