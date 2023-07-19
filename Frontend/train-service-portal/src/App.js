import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TrainList from './components/TrainList';
import SingleTrain from './components/SingleTrain';


function App() {
  return (
    <div className='App-header'>
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" children={<TrainList />} />
          <Route path="/todo/:id" children={<SingleTrain />} />
        </Switch>
      </Router>
    </div>
    </div>
  );
}

export default App;
