import Link from 'next/link'
import Watermark from '../components/Watermark'

export default function Home() {
  return (
    <div style={{padding:24}}>
      <h1 style={{color:'var(--primary)'}}>GMV 增长 Copilot</h1>
      <p>选择视角：</p>
      <ul>
        <li><Link href="/merchant">商家侧（Merchant）</Link></li>
        <li><Link href="/taoke">小B / 淘客侧（Taoke）</Link></li>
      </ul>
      <Watermark />
    </div>
  )
}
