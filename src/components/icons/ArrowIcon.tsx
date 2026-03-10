interface ArrowIconProps {
  size?: number;
  className?: string;
}

export default function ArrowIcon({ size = 17, className }: ArrowIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.7778 9L9 5.22222M12.7778 9H5.22222M12.7778 9L9 12.7778M9 0.5C7.88376 0.5 6.77846 0.719859 5.74719 1.14702C4.71592 1.57419 3.77889 2.20029 2.98959 2.98959C2.20029 3.77889 1.57419 4.71592 1.14702 5.74719C0.719859 6.77846 0.5 7.88376 0.5 9C0.5 10.1162 0.719859 11.2215 1.14702 12.2528C1.57419 13.2841 2.20029 14.2211 2.98959 15.0104C3.77889 15.7997 4.71592 16.4258 5.74719 16.853C6.77846 17.2801 7.88376 17.5 9 17.5C11.2543 17.5 13.4163 16.6045 15.0104 15.0104C16.6045 13.4163 17.5 11.2543 17.5 9C17.5 6.74566 16.6045 4.58365 15.0104 2.98959C13.4163 1.39553 11.2543 0.5 9 0.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
