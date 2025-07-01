type ILogoProps = {
  xl?: boolean;
};

const Logo = (props: ILogoProps) => {
  const size = props.xl ? '44' : '32';
  const fontStyle = props.xl ? 'font-bold text-2xl' : 'font-bold text-lg';

  return (
    <span className={`inline-flex items-center text-white ${fontStyle}`}>
      <svg
        className="mr-2 stroke-current text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Industrial gear icon */}
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6" />
        <path d="M1 12h6m6 0h6" />
        <path d="M3.6 3.6l4.2 4.2m8.4 8.4l4.2 4.2" />
        <path d="M20.4 3.6l-4.2 4.2m-8.4 8.4l-4.2 4.2" />
      </svg>

      <span className="text-blue-400">MDK</span>
      <span className="ml-1 text-gray-300">System</span>
    </span>
  );
};

export { Logo };
