import {ReactElement, useContext} from "react";
import {observer} from "mobx-react-lite";
import Flex from "../../atoms/Flex/Flex.tsx";
import {FlexAlign, FlexDirection, FlexGap} from "../../atoms/Flex/Flex.types.ts";
import Heading from "../../atoms/Heading/Heading.tsx";
import Button from "../../atoms/Button/Button.tsx";
import {AppContext} from "../../../stores/AppContext.ts";
import {Link, useLocation} from "wouter";

function Landing(): ReactElement {
  const {
    ApplicationStore
  } = useContext(AppContext);

  const [, setLocation] = useLocation();

  function handleNavigateNewApplication(){
    setLocation('/new-application');
  }

  return (
    <>
      { ApplicationStore.applications.length > 0 ? (
        <Flex flexDirection={FlexDirection.COLUMN} gap={FlexGap.MD} alignItems={FlexAlign.CENTER}>
          {ApplicationStore.applications.map((a) => {
            return (
              <Link key={a.id} to={`/a/${a.id}`}>{ a.name }</Link>
            )
          })}
          <hr />
          <Button onClick={handleNavigateNewApplication}>Add another App</Button>
        </Flex>
      ) : <Flex flexDirection={FlexDirection.COLUMN} alignItems={FlexAlign.CENTER} gap={FlexGap.MD}>
        <Heading>To get started, create a new application below.</Heading>
        <Button onClick={handleNavigateNewApplication}>Create Application</Button>
      </Flex>}
    </>
  )
}

export default observer(Landing);
