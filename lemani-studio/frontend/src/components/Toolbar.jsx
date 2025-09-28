import React from 'react'

export default function Toolbar(){
  return (
    <div className="panel">
      <h4>Outils</h4>
      <div style={{display:'flex',gap:8}}>
        <button className="btn">Select</button>
        <button className="btn">Move</button>
        <button className="btn">Rotate</button>
        <button className="btn">Scale</button>
      </div>
    </div>
  )
}
