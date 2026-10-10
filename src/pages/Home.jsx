import Hero from '../components/movies/Hero'
import NowPlaying from '../components/movies/NowPlaying'
import ComingSoon from '../components/movies/ComingSoon'
import RecentlyViewed from '../components/movies/RecentlyViewed'


export default function Home() {
  return (
    <>
      <Hero />
      <NowPlaying />
      <ComingSoon />
    </>
  )
}