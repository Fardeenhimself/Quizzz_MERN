import "./App.css";
import AppRouter from "./router/router";
import LoginContext from "./Provider/Context";

function App() {
  return (
    <LoginContext>
      <AppRouter />
    </LoginContext>
  );
}

export default App;
