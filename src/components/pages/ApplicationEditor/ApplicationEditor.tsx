import {ReactElement, useContext} from "react";
import {observer} from "mobx-react-lite";
import {AppContext} from "../../../stores/AppContext.ts";
import css from './ApplicationEditor.module.scss';
import Card from "../../atoms/Card/Card.tsx";
import Flex from "../../atoms/Flex/Flex.tsx";
import {FlexAlign, FlexDirection, FlexGap, FlexJustify} from "../../atoms/Flex/Flex.types.ts";
import {Link, Route} from "wouter";
import HierarchyRenderer from "../../organisms/HierarchyRenderer/HierarchyRenderer.tsx";
import Topper from "../../atoms/Topper/Topper.tsx";
import CanvasEditor from "../../organisms/CanvasEditor/CanvasEditor.tsx";
import MetadataEditor from "../../organisms/MetadataEditor/MetadataEditor.tsx";
import ContextEditor from "../../organisms/ContextEditor/ContextEditor.tsx";


function ApplicationEditor(): ReactElement{

  const { ApplicationStore } = useContext(AppContext);

  const application = ApplicationStore.current;
  if(!application){
    return <></>
  }

  let frameCount = 0;
  application.scenes.forEach((scene) => {
    frameCount += scene.frames.length;
  });

  return (
    <Card className={css.applicationEditor}>
      <Flex className={css.header} justifyContent={FlexJustify.SPACE_BETWEEN}>
        <span>{ application.name }</span>
        <Flex class={css.metadata} gap={FlexGap.SM}>
          <span>{application.scenes.length} Scenes</span>
          <span>{frameCount} Frames</span>
        </Flex>
      </Flex>
      <Flex className={css.menu} flexDirection={FlexDirection.COLUMN} alignItems={FlexAlign.STRETCH}>
        <Flex className={css.block}>
          <Link to="~/" className={(active) => (active ? css.active : "")}>My Apps</Link>
        </Flex>
        <Flex className={css.block} flexDirection={FlexDirection.COLUMN} gap={FlexGap.SM} alignItems={FlexAlign.STRETCH}>
          <Topper>Navigator</Topper>
          <Link to="/" className={(active) => (active ? css.active : "")}>Scene Editor</Link>
          <Link to="/metadata" className={(active) => (active ? css.active : "")}>Metadata</Link>
        </Flex>
      </Flex>
      <div className={css.hierarchy}>
        <HierarchyRenderer application={application} />
      </div>
      <div className={css.editor}>
        <Route path="/" component={CanvasEditor} />
        <Route path="/metadata" component={MetadataEditor} />
      </div>
      <ContextEditor />
    </Card>
  )
}

export default observer(ApplicationEditor);
