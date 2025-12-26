"use client"
import {useEffect, useState} from 'react'

export default function Copilot({role}:{role:'merchant'|'taoke'}) {
  const [items, setItems] = useState<Array<any>>([])
  useEffect(()=>{
    // simple static suggestions; in real use would call model/service
    if(role==='merchant'){
      setItems([
        {title:'生命周期诊断', text:'导入天池数据以启用用户旅程诊断。'},
        {title:'自动化触达', text:'建议对高价值流失用户发放优惠券。'}
      ])
    } else {
      setItems([
        {title:'选品建议', text:'优先推广高转化且佣金可观的商品。'},
        {title:'佣金优化', text:'提高低转化高佣金商品的展示频次。'}
      ])
    }
  },[role])

  return (
    <section style={{marginTop:20,padding:16,border:'1px solid rgba(0,0,0,0.06)',borderRadius:8}}>
      <h3 style={{color:'#0b66b2'}}>{role==='merchant'?'商家侧 Copilot 建议':'淘客侧 Copilot 建议'}</h3>
      <ul>
        {items.map((it,i)=>(<li key={i}><strong>{it.title}:</strong> {it.text}</li>))}
      </ul>
    </section>
  )
}
