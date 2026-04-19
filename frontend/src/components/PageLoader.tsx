export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-12 h-12">
        {/* Grey circle */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
        {/* Blue spinning sector */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
          style={{ animationDuration: '1s' }}
        />
      </div>
    </div>
  );
};
