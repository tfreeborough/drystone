import {PropsWithChildren, ReactElement, useContext, useEffect, useState} from "react";
import { observer } from "mobx-react-lite";
import {useParams} from "wouter";
import {AppContext} from "../../../stores/AppContext.ts";
import NotFound from "../../pages/NotFound/NotFound.tsx";
import {Application} from "../../../types/application.types.ts";


function ApplicationGuard({ children }: PropsWithChildren): ReactElement {
  const params = useParams();
  const [notFound, setNotFound] = useState(false);

  const {
    ApplicationStore
  } = useContext(AppContext);

  function populateIfMissing(application: Application){
    if(!application.scenes){
      application.scenes = [];
    }
    return application;
  }

  useEffect(() => {
    if(params.id){
      let application = ApplicationStore.applications.find((a) => a.id === params.id);
      if(application){
        application = populateIfMissing(application);
        ApplicationStore.setCurrentApplication(application);
      } else {
        setNotFound(true);
      }
    }
  }, [params.id])

  if(notFound){
    return <NotFound />
  }

  return (
    <>
      { children }
    </>
  )
}

export default observer(ApplicationGuard);
