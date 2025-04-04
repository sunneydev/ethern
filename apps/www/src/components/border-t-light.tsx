export function BorderTopLight() {
  return (
    <div
      aria-hidden="true"
      className="user-select-none center pointer-events-none absolute left-1/2 top-0 z-[-2] h-[200px] w-full max-w-[200px] -translate-x-1/2 -translate-y-1/2 md:max-w-[400px]"
      style={{
        background:
          "conic-gradient(from 90deg at 50% 50%, #00000000 50%, #000 50%),radial-gradient(rgba(200,200,200,0.1) 0%, transparent 80%)",
      }}
    />
  );
}
