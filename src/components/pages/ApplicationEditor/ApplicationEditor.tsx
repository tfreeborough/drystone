import {ReactElement, useContext} from "react";
import {observer} from "mobx-react-lite";
import {AppContext} from "../../../stores/AppContext.ts";
import css from './ApplicationEditor.module.scss';
import Card from "../../atoms/Card/Card.tsx";
import Flex from "../../atoms/Flex/Flex.tsx";
import {FlexAlign, FlexDirection, FlexGap, FlexJustify} from "../../atoms/Flex/Flex.types.ts";
import {Link} from "wouter";


function ApplicationEditor(): ReactElement{

  const { ApplicationStore } = useContext(AppContext);

  const application = ApplicationStore.current;
  if(!application){
    return <></>
  }

  return (
    <Card className={css.applicationEditor}>
      <Flex className={css.header} justifyContent={FlexJustify.SPACE_BETWEEN}>
        <span>{ application.name }</span>
        <Flex class={css.metadata} gap={FlexGap.SM}>
          <span>0 Scenes</span>
          <span>0 Frames</span>
        </Flex>
      </Flex>
      <Flex className={css.menu} flexDirection={FlexDirection.COLUMN} alignItems={FlexAlign.STRETCH}>
        <Flex className={css.block}>
          <Link to="~/" className={(active) => (active ? css.active : "")}>My Apps</Link>
        </Flex>
        <Flex className={css.block} flexDirection={FlexDirection.COLUMN} gap={FlexGap.SM}>
          <Link to="/" className={(active) => (active ? css.active : "")}>{ application.name }</Link>
          <Link to="/metadata">Edit Metadat 2</Link>
        </Flex>
      </Flex>
      <div className={css.hierarchy}>
        Hierarchy
      </div>
      <div className={css.editor}>
        Editor
      </div>
    </Card>
  )
}

export default observer(ApplicationEditor);
