import React, { useState } from 'react'
import Editor from './components/Editor'
import Toolbar from './components/Toolbar'
import AssetPanel from './components/AssetPanel'
import Inspector from './components/Inspector'
import ProjectSaver from './components/ProjectSaver'

export default function App(){
  const [selected, setSelected] = useState(null)
  const [sceneState, setSceneState] = useState({ objects: [] }) // simple scene model

  return (
    <div className="app">
      <header className="topbar">
        <h1>lemani Studio (prototype)</h1>
        <ProjectSaver sceneState={sceneState} setSceneState={setSceneState} />
      </header>
      <div className="layout">
        <aside className="left">
          <Toolbar />
          <AssetPanel onAdd={(obj)=> {
            // create default object and append
            const id = 'obj_' + Date.now()
            const newObj = { id, type: obj.type, position: [0,1,0], rotation: [0,0,0], scale: [1,1,1], color: obj.color || '#ffffff' }
            setSceneState(s => ({ ...s, objects: [...s.objects, newObj] }))
          }} />
        </aside>
        <main className="center">
          <Editor sceneState={sceneState} setSceneState={setSceneState} onSelect={setSelected} />
        </main>
        <aside className="right">
          <Inspector selected={selected} sceneState={sceneState} setSceneState={setSceneState} onDeselect={()=>setSelected(null)} />
        </aside>
      </div>
    </div>
  )
}
