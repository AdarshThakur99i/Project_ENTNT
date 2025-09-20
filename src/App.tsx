import { Routes, Route, Navigate } from "react-router-dom";
import AppRoutes from './routes/routes';
import { BrowserRouter as Router} from "react-router-dom";


function App() {
  return (
    <Router>
      
      

   <AppRoutes/>
   
      </Router>
    
  );
}

export default App;

