export default function WaveDivider() {
  return (
    <div
      className="flex h-10 items-center justify-center"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 32"
        className="h-8 w-full max-w-md text-cyan-500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 16C25 16 25 7 50 7C75 7 75 25 100 25C125 25 125 7 150 7C175 7 175 25 200 25C225 25 225 7 250 7C275 7 275 25 300 25C325 25 325 16 350 16C375 16 375 16 400 16"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}