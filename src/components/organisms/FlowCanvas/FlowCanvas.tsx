import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import { observer } from "mobx-react-lite";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge, applyNodeChanges, applyEdgeChanges, useReactFlow, Viewport, Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import {AppContext} from "../../../stores/AppContext.ts";
import ContextEditor from "../ContextEditor/ContextEditor.tsx";
import css from './FlowCanvas.module.scss';
import {useClickOutsideRef} from "../../../hooks/useClickOutsideRef.ts";

function FlowCanvas(){
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const contextEditorPanelRef = useRef(null);
  const reactFlowInstance = useReactFlow();

  const {
    ApplicationStore,
  } = useContext(AppContext);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  function handleMove(e){
    const viewport = reactFlowInstance.getViewport();
    const current = ApplicationStore.current;
    if(current){
      ApplicationStore.saveApplication({
        ...current,
        stageScale: viewport.zoom,
        stagePosition: { x: viewport.x, y: viewport.y }
      })
    }
  }

  function handleInit(){
    const current = ApplicationStore.current;
    if(current){
      reactFlowInstance.setViewport({
        x: current.stagePosition?.x ?? 0,
        y: current.stagePosition?.y ?? 0,
        zoom: current?.stageScale
      } as Viewport);
    }
  }

  function handleNodeDrag(e,node){
    const current = ApplicationStore.current;

    if(current){
      const scene = ApplicationStore.getScene(current.id, node.id);
      if(scene && !isNaN(node.position.x) && !isNaN(node.position.y)){
        console.log(node.position);
        ApplicationStore.updateScene(current.id, {
          ...scene,
          position: { x: node.position.x, y: node.position.y }
        });
      }
    }
  }

  function handleNodeClicked(e,node) {
    const current = ApplicationStore.current;

    if(current){
      const scene = ApplicationStore.getScene(current.id, node.id);
      if(scene){
        ApplicationStore.setEditorContext(scene);
      }
    }

  }

  function handlePaneClick(e){
    ApplicationStore.setEditorContext(null);
  }

  function reRenderNodes(contextId?: string){
    const current = ApplicationStore.current;
    if(current){
      console.log(contextId);
      const nodes = current.scenes.map((scene) => {
        return  {
          id: scene.id,
          position: scene.position,
          data: { label: scene.metadata.note || scene.id },
          draggable: contextId !== scene.id
        }
      })
      setNodes(nodes);
    }
  }

  /**
   * When the context is changed, re-render all nodes
   */
  useEffect(() => {
    const context = ApplicationStore.editorContext;
    reRenderNodes(context?.id)

  }, [ApplicationStore.current, ApplicationStore.editorContext]);

  useClickOutsideRef(contextEditorPanelRef, () => {
    console.log('close panel');
  });

  return (
    <ReactFlow
      className={css.flowCanvas}
      snapGrid={[10,10]}
      maxZoom={3}
      minZoom={1}
      snapToGrid
      nodes={nodes}
      edges={edges}
      onMove={handleMove}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={handleInit}
      defaultEdgeOptions={{ animated: true }}
      onNodeClick={handleNodeClicked}
      onNodeDrag={handleNodeDrag}
      onPaneClick={handlePaneClick}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={10} size={1} />
      {
        ApplicationStore.editorContext && (
          <Panel position="top-right" className={css.contextEditor} onBlur={() => {
            console.log('closed');
          }}>
            <ContextEditor />
          </Panel>
        )
      }
    </ReactFlow>
  )
}

export default observer(FlowCanvas);
