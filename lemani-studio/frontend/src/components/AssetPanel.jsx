import React from 'react'

const assets = [
  { id: 'box', type: 'box', label: 'Cube', color:'#ff6b6b' },
  { id: 'sphere', type: 'sphere', label: 'Sphere', color:'#60a5fa' },
  { id: 'plane', type: 'plane', label: 'Plane', color:'#94a3b8' }
]

export default function AssetPanel({ onAdd }){
  return (
    <div className="panel">
      <h4>Assets</h4>
      {assets.map(a => (
        <div key={a.id} className="asset-item" onClick={() => onAdd(a)}>
          <div style={{width:28,height:28,background:a.color,borderRadius:4}}></div>
          <div>
            <div style={{fontSize:14}}>{a.label}</div>
            <div style={{fontSize:12,color:'#64748b'}}>Type: {a.type}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
