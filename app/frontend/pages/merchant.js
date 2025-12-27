import Copilot from '../components/Copilot'
import Watermark from '../components/Watermark'

export default function Merchant({ initialData }) {
  return (
    <div style={{padding:24}}>
      <h1 className="hero-title">商家经营分分析copilot</h1>
      <span className="hero-wave" aria-hidden></span>
      <p style={{marginTop:12}}>第一个维度：<strong>站内运营分析</strong> — 横向用户旅程卡点、纵向用户生命周期分层与触达建议；第二个维度：<strong>站外/渠道分析</strong> — 广告与分销渠道流量到站内的转化对比与渠道价值评估。</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:16}}>
        <section style={{padding:16,border:'1px solid rgba(0,0,0,0.06)',borderRadius:8,background:'#fff'}}>
          <h3>站内运营分析（用户旅程）</h3>
          <p>横向：定位浏览→收藏→加购→下单 的卡点，并给出 Copilot 优化建议。</p>
          <pre style={{whiteSpace:'pre-wrap',fontSize:13,background:'#f8f9fb',padding:10,borderRadius:6}}>{JSON.stringify(initialData.overview || initialData, null, 2)}</pre>
          <h4>Copilot 建议</h4>
          <ul>
            <li>若浏览量高、转化低：提升商品详情页首屏信息与评价展示。</li>
            <li>对高价值但即将流失用户：建议投放权益券或增品激励，并提供触达文案。</li>
          </ul>
        </section>

        <section style={{padding:16,border:'1px solid rgba(0,0,0,0.06)',borderRadius:8,background:'#fff'}}>
          <h3>站外与渠道分析（渠道价值）</h3>
          <p>比较站内广告、站外投放、小B分销在站内的转化效率，评估渠道用户价值并优化投放预算。</p>
          <h4>示例洞察</h4>
          <ul>
            <li>若站外流量高但转化低：检查落地页一致性和商品匹配度。</li>
            <li>对表现好的分销渠道：考虑提高分销激励或扩大投放。</li>
          </ul>
        </section>
      </div>

      <section style={{marginTop:20,padding:16,border:'1px dashed rgba(11,102,178,0.08)',borderRadius:8,background:'#fbfeff'}}>
        <h3>用户生命周期分层（示例画像 & 触达建议）</h3>
        <p>沉没/流失用户画像示例：</p>
        <pre style={{whiteSpace:'pre-wrap',fontSize:13,background:'#fff',padding:10,borderRadius:6}}>常购类：近30天有3次以上购买，喜好：数码配件；触达建议：晒单裂变奖励、专属折扣券</pre>
        <p style={{marginTop:8}}>触达文案（示例）：“亲爱的用户，感谢你一直支持，分享晒单得现金券，限时领取！”</p>
      </section>

      <Copilot role="merchant" />
      <Watermark />
    </div>
  )
}

export async function getServerSideProps(context){
  try{
    const url = `http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7`;
    const res = await fetch(url);
    const data = await res.json();
    return { props: { initialData: data } };
  }catch(e){
    return { props: { initialData: { error: String(e) } } };
  }
}
