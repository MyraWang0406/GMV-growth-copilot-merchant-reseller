import Link from 'next/link'

export default function Home() {
  return (
    <div style={{display:'grid', gap:20}}>
      <section style={{padding:20, border:'1px solid rgba(0,0,0,0.06)', borderRadius:8}}>
        <h2 style={{color:'#0b66b2'}}>商家侧（Merchant）</h2>
        <p>面向品牌/商家：生命周期诊断、自动化触达与发券建议（需天池数据）。</p>
        <Link href="/merchant"><button style={{background:'#0b66b2', color:'white', padding:'8px 12px', borderRadius:6}}>进入商家侧</button></Link>
      </section>
      <section style={{padding:20, border:'1px solid rgba(0,0,0,0.06)', borderRadius:8}}>
        <h2 style={{color:'#0b66b2'}}>小B / 淘客侧 (Taoke)</h2>
        <p>侧重佣金与选品转化：给出基于转化率与佣金的选品建议。</p>
        <Link href="/taoke"><button style={{background:'#0b66b2', color:'white', padding:'8px 12px', borderRadius:6}}>进入淘客侧</button></Link>
      </section>
      <section style={{padding:20, border:'1px dashed rgba(0,0,0,0.06)', borderRadius:8}}>
        <strong>数据说明：</strong>
        <p>若尚未导入阿里天池用户行为数据，诊断与触达建议将处于“待启用”状态。</p>
      </section>
    </div>
  )
}
