const TypingIndicator = () => (
  <div className="flex justify-start" style={{ animation: "fadeInUp 0.3s ease" }}>
    <div className="max-w-[90%] md:max-w-[75%] px-5 py-4 rounded-2xl rounded-bl-sm bg-gradient-to-br from-bmw-blue/8 to-teal-spark/4 border border-bmw-blue/15">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-teal-spark"
              style={{
                animation: "typingBounce 1.4s infinite ease-in-out",
                animationDelay: `${-0.32 + i * 0.16}s`,
              }}
            />
          ))}
        </div>
        <div
          className="h-0.5 w-32 rounded"
          style={{
            background: "linear-gradient(90deg, hsl(var(--bmw-blue)), hsl(var(--teal-spark)), hsl(var(--bmw-blue)))",
            backgroundSize: "200% 100%",
            animation: "loadingShimmer 1.5s infinite linear",
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground font-mono">Running 8,400+ simulations...</p>
    </div>
  </div>
);

export default TypingIndicator;
