import * as React from "react";
import {
  BrowserRouter,
  Routes as Switch,
  Route,
} from "react-router-dom";
import NfGate from "./pages/NfGate";
import NotFound from "./pages/NotFound";
import Mask from "./components/Mask";



interface IAppProps { }

const App: React.FunctionComponent<IAppProps> = (props) => {

  return (
    <BrowserRouter>
      <Mask>
        <Switch>
          <Route path="/" element={<NfGate />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Switch>
      </Mask>
    </BrowserRouter>
  );
};

export default App;
