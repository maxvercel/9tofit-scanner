import MetaPixel from './MetaPixel'

export const metadata = {
  title: '9toFit — Bewegingsanalyse Scanner',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
}
export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a' }}>
        {children}
        <MetaPixel />
      </body>
    </html>
  )
}
