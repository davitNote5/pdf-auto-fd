import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import FormPage from "./pages/FormPage";
import RunDisease from "./pages/RunDiseasePage"; 
import DiseaseEngine from "./pages/DiseaseEnginePage"; 
import WordFilling from "./pages/wordFilling"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/runDisease" element={<RunDisease />} />
        <Route path="/diseaseEngine" element={<DiseaseEngine />} /> 
        <Route path="/wordFilling" element={<WordFilling />} /> 
      </Routes>
    </Router>
  );
}

export default App;