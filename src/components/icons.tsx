import type { SVGProps } from 'react';

export const MedizoAiLogo = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-primary"
      {...props}
    >
      <path d="M2 22L8 12L12 17L16 7L22 17" />
      <path d="M14 4L12 2L10 4" />
      <path d="M12 2V6" />
      <path d="M16 7L14 12" />
      <path d="M8 12L10 12" />
    </svg>
);
