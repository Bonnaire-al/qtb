import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/footer'
import Home from './pages/Home'
import Service from './pages/Service'
import About from './pages/About'
import Quote from './pages/Quote'
import Admin from './pages/admin/Admin'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/accueil" element={
          <div className="App flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/home" element={
          <div className="App flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/service" element={
          <div className="App flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Service />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="App flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <About />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/quote" element={
          <div className="App flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Quote />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/admin" element={
          <div className="App flex flex-col min-h-screen">
            <main className="flex-grow">
              <Admin />
            </main>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App
