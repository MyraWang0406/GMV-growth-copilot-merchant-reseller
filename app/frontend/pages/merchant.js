import Copilot from '../components/Copilot'
import Watermark from '../components/Watermark'

export default function Merchant() {
  return (
    <div style={{padding:24}}>
      <h1 style={{color:'var(--primary)'}}>商家侧（Merchant）</h1>
      <p>商家侧页面骨架，诊断与建议需天池数据接入后启用。</p>
      <Copilot role="merchant" />
      <Watermark />
    </div>
  )
}
