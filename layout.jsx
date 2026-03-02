export const metadata = {
  title: '9toFit — Daily Readiness Scanner',
  description: 'Performance Intelligence by 9toFit',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a' }}>
        {children}
      </body>
    </html>
  )
}
