
import "./App.css";
import { Main } from "./Components/Main"
import { ChainId, DAppProvider } from "@usedapp/core"
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <DAppProvider config={{
        supportedChains: [ChainId.Goerli],
        notifications: {
          expirationPeriod: 1000,
          checkInterval: 1000
        }
      }}>
        <Main />
      </DAppProvider>
    </Router>

  )
}

export default App;