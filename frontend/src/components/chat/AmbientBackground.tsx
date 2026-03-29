const AmbientBackground = () => (
  <>
    <div className="noise-overlay" />
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute w-[600px] h-[600px] -top-32 -left-32 bg-[radial-gradient(circle,hsl(var(--bmw-blue)/0.15)_0%,transparent_70%)] blur-[60px]" />
      <div className="absolute w-[500px] h-[500px] top-1/3 -right-32 bg-[radial-gradient(circle,hsl(var(--teal-spark)/0.08)_0%,transparent_70%)] blur-[80px]" />
      <div className="absolute w-[400px] h-[400px] bottom-0 left-1/3 bg-[radial-gradient(circle,hsl(var(--bmw-blue)/0.1)_0%,transparent_70%)] blur-[50px]" />
    </div>
  </>
);

export default AmbientBackground;
