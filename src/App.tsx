import {observer} from "mobx-react-lite";
import {Route, Switch} from 'wouter';
import Landing from "./components/pages/Landing/Landing.tsx";
import CreateApplication from "./components/pages/CreateApplication/CreateApplication.tsx";
import ApplicationEditor from './components/pages/ApplicationEditor/ApplicationEditor.tsx';
import ApplicationGuard from "./components/organisms/ApplicationGuard/ApplicationGuard.tsx";


function App() {
  return (
    <>

      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/new-application" component={CreateApplication} />
        <Route path="/a/:id" nest>
          <ApplicationGuard>
            <Route path="/" component={ApplicationEditor} nest/>
          </ApplicationGuard>
        </Route>
      </Switch>
    </>
  )
}
export default observer(App);
