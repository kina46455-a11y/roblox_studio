import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

// Simple editor: renders objects from sceneState, allows click-to-select
export default function Editor({ sceneState, setSceneState, onSelect }){
  const mountRef = useRef()

  useEffect(() => {
    const width = mountRef.current.clientWidth || 800
    const height = 520
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0xf3f6fb)
    mountRef.current.appendChild(renderer.domElement)

    // lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8)
    hemi.position.set(0,20,0); scene.add(hemi)
    const dir = new THREE.DirectionalLight(0xffffff, 0.6); dir.position.set(5,10,7); scene.add(dir)

    // ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(50,50), new THREE.MeshStandardMaterial({color:0xe6eef6}))
    ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; scene.add(ground)

    // helper: objects map id->mesh
    const meshes = {}

    function createMesh(obj){
      let geo, mat
      if(obj.type==='box') geo = new THREE.BoxGeometry(1,1,1)
      else if(obj.type==='sphere') geo = new THREE.SphereGeometry(0.6,32,32)
      else geo = new THREE.BoxGeometry(1,0.1,1) // plane placeholder

      mat = new THREE.MeshStandardMaterial({ color: obj.color || '#cccccc' })
      const m = new THREE.Mesh(geo, mat)
      m.position.set(...obj.position)
      m.rotation.set(...obj.rotation)
      m.scale.set(...obj.scale)
      m.userData.id = obj.id
      scene.add(m)
      meshes[obj.id] = m
    }

    // initial create
    sceneState.objects.forEach(o => createMesh(o))

    // raycaster for selection
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    function onClick(e){
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = - ((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(Object.values(meshes))
      if(hits.length>0){
        const id = hits[0].object.userData.id
        onSelect && onSelect(id)
      } else onSelect && onSelect(null)
    }
    renderer.domElement.addEventListener('pointerdown', onClick)

    // animation loop
    camera.position.set(5,6,8); camera.lookAt(0,1,0)
    function animate(){
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    // react to sceneState changes by syncing meshes (simple approach)
    const observer = new MutationObserver(()=>{})
    // provide a simple update function on setSceneState: we won't hook observer; instead re-render on each state change via interval
    let lastJSON = JSON.stringify(sceneState)
    const interval = setInterval(()=> {
      const j = JSON.stringify(sceneState)
      if(j!==lastJSON){
        // remove old meshes
        Object.values(meshes).forEach(m => { scene.remove(m); if(m.geometry) m.geometry.dispose(); if(m.material) m.material.dispose() })
        Object.keys(meshes).forEach(k=>delete meshes[k])
        // recreate
        sceneState.objects.forEach(o=>createMesh(o))
        lastJSON = j
      }
    }, 300)

    // cleanup
    return () => {
      clearInterval(interval)
      renderer.domElement.removeEventListener('pointerdown', onClick)
      mountRef.current.removeChild(renderer.domElement)
    }
  }, [sceneState])

  return <div ref={mountRef} style={{width:'100%'}}></div>
}
