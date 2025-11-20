import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const createIcon = (path: React.ReactNode) => (props: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {path}
    </svg>
);

export const Icons = {
    Play: createIcon(<polygon points="5 3 19 12 5 21 5 3"></polygon>),
    Pause: createIcon(<><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></>),
    StepForward: createIcon(<><polygon points="6 4 14 12 6 20 6 4"></polygon><line x1="18" y1="4" x2="18" y2="20"></line></>),
    RefreshCw: createIcon(<><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 14 1 20 7 20"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></>),
    Trash: createIcon(<><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></>),
    PlusCircle: createIcon(<><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></>),
    ArrowRight: createIcon(<><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></>),
    HelpCircle: createIcon(<><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></>),
    Code: createIcon(<><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></>),
    ChevronRight: createIcon(<polyline points="9 18 15 12 9 6"></polyline>),
    Rabbit: createIcon(<><path d="M13 16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1m9 0 3-3 3 3m-9 4 4-4"></path><path d="M18 10h3v4a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Z"></path><path d="M5 11h2"></path><path d="M7 8v3"></path></>),
    Turtle: createIcon(<><path d="m15.5 16-3 3-3-3"></path><path d="M17 21h-8a2 2 0 0 1-2-2v-2h8v2a2 2 0 0 1-2 2Z"></path><path d="M18 17a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2h8Z"></path><path d="M8 17H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1l2 3 2-3h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3"></path><path d="M12 7V5l-1-1-1 1v2"></path></>),
    FileText: createIcon(<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></>),
    AlertTriangle: createIcon(<><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></>),
    Volume2: createIcon(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></>),
    VolumeX: createIcon(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></>),
    Diagram: createIcon(<><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></>),
    Activity: createIcon(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>),
    CheckCircle: createIcon(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></>)
};