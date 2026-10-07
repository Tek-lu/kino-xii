import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Sessions from './pages/Sessions'
import MovieDetail from './pages/MovieDetail'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/movies/:slug" element={<MovieDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}
