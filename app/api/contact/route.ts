import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // 입력 검증
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 })
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '올바른 이메일 형식을 입력해주세요.' }, { status: 400 })
    }

    // Gmail SMTP 설정
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // 환경변수에서 Gmail 주소
        pass: process.env.GMAIL_APP_PASSWORD, // 환경변수에서 Gmail 앱 패스워드
      },
    })

    // 본인에게 보낼 메일 설정
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // 본인 이메일
      subject: `[포트폴리오 문의] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">새로운 문의가 도착했습니다!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 10px; font-size: 18px;">📋 문의 정보</h2>
              <div style="background: #f1f3f4; padding: 15px; border-radius: 8px;">
                <p style="margin: 8px 0; color: #555;"><strong>👤 이름:</strong> ${name}</p>
                <p style="margin: 8px 0; color: #555;"><strong>📧 이메일:</strong> ${email}</p>
                <p style="margin: 8px 0; color: #555;"><strong>📌 제목:</strong> ${subject}</p>
                <p style="margin: 8px 0; color: #555;"><strong>⏰ 접수 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 10px; font-size: 18px;">💬 메시지 내용</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                📧 답장하기
              </a>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #e8f4fd; border-radius: 6px; border: 1px solid #bee5eb;">
              <p style="margin: 0; color: #0c5460; font-size: 14px; text-align: center;">
                <strong>💡 TIP:</strong> 이 이메일에 직접 답장하거나 위 버튼을 클릭하여 문의자에게 답변하세요.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
            <p>이 메일은 포트폴리오 웹사이트의 Contact 폼을 통해 자동 발송된 메일입니다.</p>
          </div>
        </div>
      `,
    }

    // 문의자에게 자동 응답 메일 설정
    const autoReplyOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `[자동응답] 문의해주셔서 감사합니다 - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">문의해주셔서 감사합니다!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">안녕하세요, <strong>${name}</strong>님!</p>
            
            <p style="color: #555; line-height: 1.6;">
              소중한 시간을 내어 문의해주셔서 진심으로 감사합니다. <br>
              아래 내용으로 문의를 접수하였습니다.
            </p>
            
            <div style="background: #f1f3f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📋 접수된 문의 내용</h3>
              <p style="margin: 8px 0; color: #555;"><strong>제목:</strong> ${subject}</p>
              <p style="margin: 8px 0; color: #555;"><strong>접수 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
            </div>
            
            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; border: 1px solid #bee5eb; margin: 20px 0;">
              <h3 style="color: #0c5460; margin-top: 0;">⏰ 답변 안내</h3>
              <p style="color: #0c5460; margin: 0; line-height: 1.6;">
                평일 기준 <strong>1-2일 이내</strong>에 답변드릴 예정입니다. <br>
                급한 사항이 있으시면 <strong>roono.help@gmail.com</strong>으로 직접 연락해주세요.
              </p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              다시 한번 문의해주셔서 감사드리며, 빠른 시일 내에 성실한 답변으로 찾아뵙겠습니다.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #333; font-weight: bold;">김동현 드림</p>
              <p style="color: #666; font-size: 14px;">Full Stack Developer & Sound Designer</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
            <p>이 메일은 자동 발송된 메일입니다. 이 메일에 직접 답장하지 마세요.</p>
          </div>
        </div>
      `,
    }

    // 메일 발송
    await Promise.all([transporter.sendMail(mailOptions), transporter.sendMail(autoReplyOptions)])

    return NextResponse.json({ message: '메시지가 성공적으로 전송되었습니다.' }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: '메시지 전송 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
