import TextHeadingAnimation from "./TextHeadingAnimation";

function TestingAnimation() {
  return (
    <main className="relative min-h-dvh w-screen bg-neutral-900 text-neutral-100 overflow-x-hidden">
      <div className="flex flex-col w-full min-h-full">
        {/* TOP SECTION */}
        <section className="flex h-dvh w-full flex-col items-center justify-center bg-neutral-800 border-b border-neutral-700 p-8">
          <span className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Self-Triggered (Tanpa Props Trigger)</span>

          <TextHeadingAnimation
            text="Hello World"
            // Properti 'trigger' dihapus!
            start="top center"
            end="center center"
            className="text-4xl font-bold"
          />
        </section>

        {/* BOTTOM SECTION */}
        <section className="flex h-dvh w-full flex-col items-center justify-center bg-neutral-850 p-8">
          <span className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Self-Triggered (Tanpa Props Trigger)</span>

          <TextHeadingAnimation
            text="And this heading text waits until ITSELF enters the viewport to trigger its scrub effect."
            // Properti 'trigger' dihapus!
            start="top center+=10%"
            end="bottom center"
            className="text-2xl md:text-4xl font-bold max-w-2xl text-center text-indigo-400"
          />
        </section>
      </div>
    </main>
  );
}

export default TestingAnimation;
