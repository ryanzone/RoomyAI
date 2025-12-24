import TextType from '@/components/TextType.jsx';

export default function Hero() {
  return (
    <main className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
      <div className="max-w-4xl space-y-6 md:space-y-10">
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-[1.1] min-h-[1.5em] md:min-h-[1.2em]">
          <TextType 
            text={["Design your dream Room.", "Describe your style.", "RoomyAI handles the rest."]}
            typingSpeed={150}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto font-light">
          The AI-powered interior designer that turns your vague descriptions into stunning realities.
        </p>
      </div>
    </main>
  );
}