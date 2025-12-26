import './globals.css'

export const metadata = {
  title: 'GMV 增长 Copilot',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div style={{position: 'relative', minHeight: '100vh', background: 'white'}}>
          <header style={{padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)'}}>
            <h1 style={{margin:0, color:'#0b66b2'}}>GMV 增长 Copilot</h1>
            <div style={{fontSize:12, color:'rgba(0,0,0,0.5)'}}>商家侧 / 小B/淘客侧 视角</div>
          </header>
          <main style={{padding:24}}>{children}</main>
          <footer style={{position:'absolute', right:8, bottom:8, opacity:0.35, fontSize:12}}>
            联系作者 myrawzm0406@163.com 微信15301052620
          </footer>
        </div>
      </body>
    </html>
  )
}
