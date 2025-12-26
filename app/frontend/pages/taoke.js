import Copilot from '../components/Copilot'
import Watermark from '../components/Watermark'

export default function Taoke() {
  return (
    <div style={{padding:24}}>
      <h1 style={{color:'var(--primary)'}}>淘客侧（Taoke）</h1>
      <p>淘客侧页面骨架，展示佣金与选品建议。</p>
      <Copilot role="taoke" />
      <Watermark />
    </div>
  )
}
