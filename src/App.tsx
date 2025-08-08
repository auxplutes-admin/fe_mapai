import './App.css'
import AppRouter from "./AppRouter";
import { BrowserRouter } from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
        </AuthProvider>
    </>
  )
}

export default App
