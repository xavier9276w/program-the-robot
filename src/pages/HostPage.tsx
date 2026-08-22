import { QRCodeSVG } from 'qrcode.react'

export function HostPage() {
  const gameUrl = import.meta.env.VITE_GAME_URL || window.location.origin

  return (
    <div className="min-h-dvh bg-bg-dark flex flex-col items-center justify-center p-8">
      <div className="text-6xl mb-4">🤖</div>
      <h1 className="text-4xl font-black text-text-primary mb-2 text-center">
        Program the Robot
      </h1>
      <p className="text-lg text-text-secondary mb-8 text-center">
        Scan to play on your phone!
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-2xl mb-8">
        <QRCodeSVG
          value={gameUrl}
          size={280}
          level="M"
          bgColor="#ffffff"
          fgColor="#0a0a1a"
        />
      </div>

      <div className="text-sm text-text-secondary text-center max-w-md">
        <p className="mb-2 font-semibold text-primary-light">{gameUrl}</p>
        <p>Open this page on a projector or large screen. Players scan the QR code to play on their phones.</p>
      </div>
    </div>
  )
}
