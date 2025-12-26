import Copilot from '../../components/Copilot'

export default async function MerchantPage() {
  // server component fetching dashboard via internal proxy
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7`, {cache: 'no-store'})
  let data = null
  try { data = await res.json() } catch (e) { data = null }

  return (
    <div>
      <h2 style={{color:'#0b66b2'}}>商家侧 Dashboard</h2>
      <p>概览（注意：若未接入天池数据，部分字段为占位）</p>
      <pre style={{background:'#f7f9fb', padding:12}}>{JSON.stringify(data, null, 2)}</pre>
      <Copilot role="merchant" />
    </div>
  )
}
