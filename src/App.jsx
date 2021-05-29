import './App.css';
import {BrowserRouter } from 'react-router-dom';
import MainComponent from './components/MainComponent';
import { Provider } from 'react-redux';
import ConfigurationStore from './Redux/configurationStore';
const store= ConfigurationStore();
function App() {
  return (
    <div className="App">
      <Provider store={store} >
        <BrowserRouter>
            <MainComponent/>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
