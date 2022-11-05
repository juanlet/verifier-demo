import '@/App.css'
import VerifyPage from '@/containers/VerifyPage'
import { Route, Routes } from 'react-router-dom'
import SuccessPage from './containers/SuccessPage'
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<VerifyPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </div>
  )
}

export default App
