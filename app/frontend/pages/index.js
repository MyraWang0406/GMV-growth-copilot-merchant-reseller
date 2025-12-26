import Link from 'next/link'
import Watermark from '../components/Watermark'

export default function Home() {
  return (
    <div style={{padding:24}}>
      <h1 className="hero-title">商家经营分分析copilot</h1>
      <span className="hero-wave" aria-hidden></span>
      <p style={{marginTop:12}}>选择视角：</p>
      <ul>
        <li><Link href="/merchant">站内/站外分析（商家视角）</Link></li>
        <li><Link href="/taoke">分销/淘客视角</Link></li>
      </ul>
      <Watermark />
    </div>
  )
}
