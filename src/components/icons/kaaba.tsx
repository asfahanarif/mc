
export const KaabaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="black"
        strokeWidth="0.5"
        {...props}
    >
        <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#FFD700', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#B8860B', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <path d="M4 4L12 2L20 4L12 6L4 4Z" fill="url(#gold-gradient)" stroke="black" strokeLinejoin="round" />
        <path d="M4 4V18L12 22V6L4 4Z" fill="#222" stroke="black" strokeLinejoin="round" />
        <path d="M20 4V18L12 22V6L20 4Z" fill="#333" stroke="black" strokeLinejoin="round" />
        <path d="M6 8L10 9" stroke="url(#gold-gradient)" strokeWidth="0.7" />
    </svg>
);
