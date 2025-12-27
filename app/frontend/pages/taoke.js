import Watermark from '../components/Watermark'

export default function Taoke({ initialData }){
  return (
    <div style={{padding:24}}>
      <h1 className="hero-title">商家经营分分析copilot — 分销/淘客视角</h1>
      <span className="hero-wave" aria-hidden></span>
      <p style={{marginTop:12}}>展示不同渠道（站内广告 / 站外投放 / 小B分销）的流量与转化情况，衡量渠道用户价值。</p>

      <section style={{marginTop:16,padding:16,border:'1px solid rgba(0,0,0,0.06)',borderRadius:8,background:'#fff'}}>
        <h3>渠道概览</h3>
        <pre style={{whiteSpace:'pre-wrap',fontSize:13,background:'#f8f9fb',padding:10,borderRadius:6}}>{JSON.stringify(initialData, null, 2)}</pre>
        <h4>示例建议</h4>
        <ul>
          <li>优化站外投放落地页以提高到站转化率。</li>
          <li>对表现稳定的分销渠道增加激励，提高复购。</li>
        </ul>
      </section>

      <Watermark />
    </div>
  )
}

export async function getServerSideProps(){
  try{
    const url = `http://127.0.0.1:8000/taoke`;
    const res = await fetch(url);
    const data = await res.json();
    return { props: { initialData: data } }
  }catch(e){
    return { props: { initialData: { error: String(e) } } }
  }
}
