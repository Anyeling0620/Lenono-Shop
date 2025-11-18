// import AgreementModal from "./Component/AgreementModal "
import Footer from "./Component/Footer"
import Header from "./Component/Header"
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Reg from "./pages/Reg"
import RightNavBar from "./Component/RightNavBar"
import Index from "./pages"


function App() {


  return (
    <>

      <Header />
      <RightNavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Reg' element={<Reg />} />
      </Routes>
      {/* <AgreementModal /> */}
      <Footer />
    </>
  )
}

export default App
