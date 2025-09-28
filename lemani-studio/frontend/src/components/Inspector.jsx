import React, { useState, useEffect } from 'react'

export default function Inspector({ selected, sceneState, setSceneState, onDeselect }){
  const [local, setLocal] = useState(null)

  useEffect(() => {
    if(selected){
      const obj = sceneState.objects.find(o=>o.id===selected)
      setLocal(obj ? {...obj} : null)
    } else setLocal(null)
  }, [selected, sceneState])

  if(!local) return <div className="panel"><h4>Inspector</h4><div>Sélectionne un objet</div></div>

  function apply(){
    setSceneState(s => ({...s, objects: s.objects.map(o => o.id===local.id ? local : o)}))
  }

  function remove(){
    setSceneState(s => ({...s, objects: s.objects.filter(o => o.id!==local.id)}))
    onDeselect && onDeselect()
  }

  return (
    <div className="panel">
      <h4>Inspector</h4>
      <label>Id</label><input value={local.id} readOnly />
      <label>Type</label><input value={local.type} readOnly />
      <label>Position (x y z)</label>
      <div style={{display:'flex',gap:6}}>
        <input type="number" value={local.position[0]} onChange={e=>setLocal({...local, position:[parseFloat(e.target.value)||0, local.position[1], local.position[2]]})} />
        <input type="number" value={local.position[1]} onChange={e=>setLocal({...local, position:[local.position[0], parseFloat(e.target.value)||0, local.position[2]]})} />
        <input type="number" value={local.position[2]} onChange={e=>setLocal({...local, position:[local.position[0], local.position[1], parseFloat(e.target.value)||0]})} />
      </div>
      <label>Scale (x y z)</label>
      <div style={{display:'flex',gap:6}}>
        <input type="number" value={local.scale[0]} onChange={e=>setLocal({...local, scale:[parseFloat(e.target.value)||1, local.scale[1], local.scale[2]]})} />
        <input type="number" value={local.scale[1]} onChange={e=>setLocal({...local, scale:[local.scale[0], parseFloat(e.target.value)||1, local.scale[2]]})} />
        <input type="number" value={local.scale[2]} onChange={e=>setLocal({...local, scale:[local.scale[0], local.scale[1], parseFloat(e.target.value)||1]})} />
      </div>
      <label>Color</label>
      <input type="text" value={local.color} onChange={e=>setLocal({...local, color:e.target.value})} />
      <div style={{display:'flex',gap:8, marginTop:8}}>
        <button className="btn" onClick={apply}>Apply</button>
        <button className="btn" onClick={remove}>Delete</button>
      </div>
    </div>
  )
}
