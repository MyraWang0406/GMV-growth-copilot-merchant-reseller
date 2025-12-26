import Copilot from '../../components/Copilot'

export default async function TaokePage() {
  // placeholder server component
  return (
    <div>
      <h2 style={{color:'#0b66b2'}}>淘客侧 Dashboard</h2>
      <p>基于佣金与转化率的选品优化建议。</p>
      <Copilot role="taoke" />
    </div>
  )
}
