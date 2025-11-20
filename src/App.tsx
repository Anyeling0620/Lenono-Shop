// import AgreementModal from "./Component/AgreementModal "
import Footer from "./Component/Footer"
import Header from "./Component/Header"
import { Routes, Route } from "react-router-dom"
import Login from "./Pages/Login"
import Reg from "./Pages/Reg"
import RightNavBar from "./Component/RightNavBar"
import Roll from "./Pages/Roll"
import Index from "./Pages/Index"


function App() {


  return (
    <>
      <Header />
      <RightNavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Reg' element={<Reg />} />
        <Route path='/Roll' element={<Roll />} />
      </Routes>
      {/* <AgreementModal /> */}
      <Footer />
    </>
  )
}

export default App
