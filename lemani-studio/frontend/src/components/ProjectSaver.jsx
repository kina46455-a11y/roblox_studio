import React from 'react'

export default function ProjectSaver({ sceneState, setSceneState }){
  function exportJSON(){
    const blob = new Blob([JSON.stringify(sceneState, null, 2)], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lemani_scene_export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJSON(e){
    const file = e.target.files[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try{
        const data = JSON.parse(ev.target.result)
        setSceneState(data)
      }catch(err){ alert('Fichier invalide') }
    }
    reader.readAsText(file)
  }

  return (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <button className="btn" onClick={exportJSON}>Exporter</button>
      <label className="btn" style={{cursor:'pointer'}}>
        Importer
        <input type="file" onChange={importJSON} style={{display:'none'}} accept=".json" />
      </label>
    </div>
  )
}
