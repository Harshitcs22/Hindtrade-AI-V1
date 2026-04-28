export default function StatsBackground() {
  // Abstract heights representing steady growth, similar to India's export data
  const bars = [20, 35, 25, 45, 60, 55, 75, 90, 85, 100];
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0A0A] pointer-events-none flex items-end justify-center pb-0 opacity-20">
      {/* Gradient mask to fade out the top and sides */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#0A0A0A]/50 to-[#0A0A0A] z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] z-10"></div>
      
      {/* Abstract Bar Chart */}
      <div className="flex items-end justify-between w-full max-w-6xl px-10 h-[60vh] gap-4 sm:gap-8">
        {bars.map((height, i) => (
          <div 
            key={i}
            className="w-full max-w-[40px] bg-gradient-to-t from-[#D4CAA3]/30 to-[#F9F6EE]/5 rounded-t-sm"
            style={{ 
              height: `${height}%`,
              // Add a subtle glowing top edge
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
