import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import { observer } from "mobx-react-lite";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges, applyEdgeChanges, useReactFlow, Viewport, Node, Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import {AppContext} from "../../../stores/AppContext.ts";
import css from './FlowCanvas.module.scss';
import SceneNode from "./Custom Nodes/SceneNode/SceneNode.tsx";
import PanelContextMenu from "../PanelContextMenu/PanelContextMenu.tsx";
import SceneContextMenu from "../SceneContextMenu/SceneContextMenu.tsx";
import NewChoiceModal from "../NewChoiceModal/NewChoiceModal.tsx";
import ApplicationStore from "../../../stores/ApplicationStore.ts";

const nodeTypes: any = { scene: SceneNode }

const isValidNumber = (num) => typeof num === 'number' && isFinite(num);

function FlowCanvas(){
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [menu, setMenu] = useState<null | any>(null);
  const [sceneMenu, setSceneMenu] = useState<null | any>(null);
  const [choiceMenu, setChoiceMenu] = useState<null | any>(null);
  const [newChoiceModalOpen, setNewChoiceModalOpen] = useState(false);
  const [pendingEdge, setPendingEdge] = useState(null);

  const panelRef = useRef(null);
  const reactFlowInstance = useReactFlow();

  const {
    ApplicationStore,
  } = useContext(AppContext);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => {
      nds.map((node) => {
        /**
         * Bug in v12 of react flow means we have to check these positions to guard against NaN values, unfortunately.
         */
        if(!isNaN(node.position.x) && !isNaN(node.position.y)){
          return node;
        }
      })
      return applyNodeChanges(changes, nds)
    }),
    [setNodes],
  );
  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) =>
      applyEdgeChanges(changes, eds).filter(edge => {
        const sourceNode = reactFlowInstance.getNode(edge.source);
        const targetNode = reactFlowInstance.getNode(edge.target);
        return (
          sourceNode &&
          targetNode &&
          isValidNumber(sourceNode.position.x) &&
          isValidNumber(sourceNode.position.y) &&
          isValidNumber(targetNode.position.x) &&
          isValidNumber(targetNode.position.y)
        );
      })
    );
  }, [reactFlowInstance.getNode]);

  function handleMove(){
    const viewport = reactFlowInstance.getViewport();
    const current = ApplicationStore.current;
    if(current && !isNaN(viewport.x) && !isNaN(viewport.y)){
      ApplicationStore.saveApplication({
        ...current,
        stageScale: viewport.zoom,
        stagePosition: { x: Math.floor(viewport.x), y: Math.floor(viewport.y) }
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

  function handlePaneClick(){
    ApplicationStore.setEditorContext(null);
    setSceneMenu(null);
    setMenu(null);
  }

  function reRenderNodes(){
    const current = ApplicationStore.current;
    if(current){
      const nodes = current.scenes.map((scene) => {
        return  {
          id: scene.id,
          type: 'scene',
          position: scene.position,
          data: {
            label: scene.metadata.note || scene.id,
            scene,
          },
        }
      })
      const edges = [];
      current.scenes.forEach((scene) => {
        scene.choices.forEach((choice) => {
          edges.push({
            id: choice.id,
            source: scene.id,
            target: choice.target,
            label: choice.label
          });
        })
      })
      setNodes(nodes);
      setEdges(edges);
    }
  }

  function handleDeleteChoice(edges: Edge[]){
    const application = ApplicationStore.current;
    if(application){
      edges.forEach((edge) => {
        ApplicationStore.removeChoice(application.id, edge.source, edge.id);
      })
    }

  }

  const onContextMenu = useCallback(
    (event) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = panelRef.current.getBoundingClientRect();
      const x = event.clientX - pane.left;
      const y = event.clientY - pane.top;

      setMenu({
        top: y < pane.height - 200 ? y : null,
        left: x < pane.width - 200 ? x : null,
        right: x >= pane.width - 200 ? pane.width - x : null,
        bottom: y >= pane.height - 200 ? pane.height - y : null,
      });
      setSceneMenu(null);
    },
    [setMenu],
  );

  const onSceneContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      event.stopPropagation();
      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = panelRef.current.getBoundingClientRect();
      const x = event.clientX - pane.left;
      const y = event.clientY - pane.top;
      setMenu(null);
      setSceneMenu({
        id: node.id,
        top: y < pane.height - 200 ? y : null,
        left: x < pane.width - 200 ? x : null,
      });
    },
    [setSceneMenu]
  );

  const closeSceneMenu = () => setSceneMenu(null);

  const onConnect = useCallback((params) => {
    setPendingEdge(params);
    setNewChoiceModalOpen(true);
  }, []);

  const onChoiceContextMenu = useCallback(
    (event, edge) => {
      event.preventDefault();
      event.stopPropagation();
      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = panelRef.current.getBoundingClientRect();
      const x = event.clientX - pane.left;
      const y = event.clientY - pane.top;
      setMenu(null);
      setSceneMenu(null);
      setChoiceMenu({
        id: edge.id,
        top: y < pane.height - 200 ? y : null,
        left: x < pane.width - 200 ? x : null,
      });
    },
    [setSceneMenu]
  );



  /**
   * When the context, current application or scene count is changed, re-render all nodes
   */
  useEffect(() => {
    reRenderNodes()
  }, [
    ApplicationStore.editorContext,
    ApplicationStore.current?.scenes.length,
    ApplicationStore.totalChoicesForCurrent
  ]);

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      className={css.flowCanvas}
      snapGrid={[5,5]}
      maxZoom={4}
      minZoom={0.5}
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
      onEdgesDelete={handleDeleteChoice}
      onPaneClick={handlePaneClick}
      onContextMenu={onContextMenu}
      onNodeContextMenu={onSceneContextMenu}
      onEdgeContextMenu={onChoiceContextMenu}
      ref={panelRef}
    >
      <Controls />
      <Background variant="dots" gap={10} size={1} />
      {menu && <PanelContextMenu onClick={handlePaneClick} {...menu} />}
      {sceneMenu && (
        <SceneContextMenu
          id={sceneMenu.id}
          top={sceneMenu.top}
          left={sceneMenu.left}
          onClose={closeSceneMenu}
        />
      )}
      <NewChoiceModal
        isOpen={newChoiceModalOpen}
        onClose={() => setNewChoiceModalOpen(false)}
        edgeInfo={pendingEdge}
      />
    </ReactFlow>
  )
}

export default observer(FlowCanvas);
