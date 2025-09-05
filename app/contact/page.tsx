'use client'

import { useState, useEffect } from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'
import ScrollReveal from '@/components/ScrollReveal'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isVisible, setIsVisible] = useState(false)

  // Initial page load animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      <AnimatedBackground />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          className={`mb-16 text-center transition-all delay-200 duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h1 className="mb-6 text-5xl font-bold sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Contact
            </span>
          </h1>
          <div className="from-primary-500 mx-auto mb-6 h-1 w-16 rounded-full bg-gradient-to-r to-blue-500"></div>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-300 sm:text-xl">
            프로젝트 문의, 협업 제안, 또는 궁금한 점이 있으시면 언제든지 연락해주세요
          </p>
        </div>

        {/* Contact Form */}
        <div
          className={`mx-auto max-w-2xl transition-all delay-400 duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-8 backdrop-blur-lg">
            <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-100">
              <svg
                className="text-primary-400 mr-3 h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              메시지 보내기
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
                    이름 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-gray-100 placeholder-gray-400 transition-all duration-300 focus:ring-2"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-gray-100 placeholder-gray-400 transition-all duration-300 focus:ring-2"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-300">
                  제목 *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-gray-100 placeholder-gray-400 transition-all duration-300 focus:ring-2"
                  placeholder="프로젝트 협업 문의"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-300">
                  메시지 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="focus:border-primary-500 focus:ring-primary-500/20 w-full resize-none rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-gray-100 placeholder-gray-400 transition-all duration-300 focus:ring-2"
                  placeholder="안녕하세요. 프로젝트 관련하여 문의드리고 싶은 내용이 있습니다..."
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/20 p-4 text-sm text-green-400">
                  메시지가 성공적으로 전송되었습니다! 빠른 시일 내에 답변드리겠습니다.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/20 p-4 text-sm text-red-400">
                  메시지 전송 중 오류가 발생했습니다. 나중에 다시 시도해주세요.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="hover:border-primary-500/50 hover:text-primary-100 group inline-flex w-full transform items-center justify-center rounded-2xl border border-gray-700 bg-gray-800/50 px-8 py-4 text-lg font-semibold text-gray-200 transition-all duration-300 hover:scale-105 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-3 -ml-1 h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    전송 중...
                  </>
                ) : (
                  <>메시지 보내기</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
