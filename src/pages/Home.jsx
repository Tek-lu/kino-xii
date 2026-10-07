import Hero from '../components/movies/Hero'
import NowPlaying from '../components/movies/NowPlaying'
import ComingSoon from '../components/movies/ComingSoon'

export default function Home() {
  return (
    <>
      <Hero />
      {/* seen bu users who are logged in
      <RecentlySeen /> */}
      <NowPlaying />
      <ComingSoon />
    </>
  )
}