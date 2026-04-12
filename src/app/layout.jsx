export const metadata = {
  title: '9toFit — Bewegingsanalyse Scanner',
}
export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a' }}>
        {children}
      </body>
    </html>
  )
}  
