import {ReactElement, useContext, useState} from "react";
import { v4 } from 'uuid';
import {observer} from "mobx-react-lite";
import css from './CreateApplication.module.scss';
import Card from "../../atoms/Card/Card.tsx";
import TextInput from "../../atoms/TextInput/TextInput.tsx";
import Flex from "../../atoms/Flex/Flex.tsx";
import {FlexDirection, FlexGap} from "../../atoms/Flex/Flex.types.ts";
import Button from "../../atoms/Button/Button.tsx";
import {AppContext} from "../../../stores/AppContext.ts";
import {useLocation} from "wouter";

function CreateApplication(): ReactElement {
  const [applicationName, setApplicationName] = useState("");
  const [applicationDescription, setApplicationDescription] = useState("");

  const [,setLocation] = useLocation();

  const {
    ApplicationStore,
  } = useContext(AppContext);

  function handleCreateApplication(){
    const application = {
      id: v4(),
      name: applicationName,
      description: applicationDescription,
    }
    ApplicationStore.setCurrentApplication(application);
    ApplicationStore.addApplication(application);
    setLocation(`/a/${application.id}`)
  }

  return (
    <Card className={css.createApplication}>
      <Flex flexDirection={FlexDirection.COLUMN} gap={FlexGap.MD}>
        <div>
          My new application is
          called <TextInput inline value={applicationName} onChange={(value) => setApplicationName(value)}/>
        </div>
        <div>
          When new readers/player first load up my application, they will see the following description: <br />
          <TextInput inline
                     value={applicationDescription}
                     onChange={(value) => setApplicationDescription(value)}/>
        </div>
        <Button disabled={applicationName.length === 0 || applicationDescription.length <= 10} onClick={handleCreateApplication}>Save</Button>
      </Flex>

    </Card>
  )
}

export default observer(CreateApplication);
