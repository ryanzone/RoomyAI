import Silk from '@/components/silk.jsx';
import Navbar from '@/components/navbar';
import Hero from '@/components/hero';

export default function Home() {
  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <div className="absolute inset-0 h-full w-full z-0">
        <Silk speed={5} scale={1.5} color="#160279" noiseIntensity={1.5} rotation={2.35} />
      </div>

      <Navbar />
      <Hero />
    </div>
  );
}