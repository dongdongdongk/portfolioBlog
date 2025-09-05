'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface ProjectToggleProps {
  onRoleChange: (role: 'Developer' | 'Sound Designer') => void
  defaultRole?: 'Developer' | 'Sound Designer'
}

export default function ProjectToggle({ onRoleChange, defaultRole = 'Developer' }: ProjectToggleProps) {
  const searchParams = useSearchParams()
  const [activeRole, setActiveRole] = useState<'Developer' | 'Sound Designer'>(defaultRole)

  useEffect(() => {
    // URL 파라미터에서 role 확인 (초기 로드시에만)
    const roleParam = searchParams.get('role')
    if (roleParam === 'developer' || roleParam === 'sound-designer') {
      const role = roleParam === 'developer' ? 'Developer' : 'Sound Designer'
      setActiveRole(role)
      onRoleChange(role)
    } else {
      // 기본값 설정
      setActiveRole(defaultRole)
      onRoleChange(defaultRole)
    }
  }, []) // 빈 배열로 변경하여 초기 로드시에만 실행

  const handleRoleChange = (role: 'Developer' | 'Sound Designer') => {
    setActiveRole(role)
    onRoleChange(role)
  }

  return (
    <div className="relative mb-12">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl opacity-30 rounded-full transform scale-150"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-500/5 to-purple-600/5 blur-2xl opacity-40 rounded-full transform scale-125"></div>
      </div>
      
      <div className="flex justify-center">
        <div className="relative bg-gray-900/60 backdrop-blur-md rounded-2xl p-2 border border-gray-700/40 shadow-2xl">
          <div 
            className={`absolute top-2 bottom-2 w-1/2 bg-gradient-to-r rounded-xl transition-all duration-300 ease-out shadow-lg ${
              activeRole === 'Developer' 
                ? 'left-2 from-blue-500/30 to-cyan-500/30 border border-blue-400/40' 
                : 'left-1/2 from-purple-500/30 to-pink-500/30 border border-purple-400/40'
            }`}
          />
          <div className="relative flex">
            <button
              onClick={() => handleRoleChange('Developer')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative z-10 min-w-[200px] ${
                activeRole === 'Developer'
                  ? 'text-blue-200 shadow-lg'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl"></span>
                <span>Developer</span>
              </div>
            </button>
            <button
              onClick={() => handleRoleChange('Sound Designer')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative z-10 min-w-[200px] ${
                activeRole === 'Sound Designer'
                  ? 'text-purple-200 shadow-lg'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl"></span>
                <span>Sound Designer</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}