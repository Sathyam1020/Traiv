import {
  BookOpen,
  ClipboardList,
  Dumbbell,
  LayoutGrid,
  LogOut,
  Moon,
  Salad,
  Settings,
  Sun,
  Users,
  type Icon,
} from "@traiv/ui/icons";

/** Solid silhouettes are confined to the desktop rail; content/mobile icons stay outlined. */
export function SolidSidebarIcon({ icon: Outline, className }: { icon: Icon; className?: string }) {
  let shape;
  if (Outline === Users)
    shape = (
      <>
        <circle cx="9" cy="7" r="4" />
        <circle cx="18" cy="8" r="3" />
        <path d="M1 21v-3a8 8 0 0 1 16 0v3zm17-6a9 9 0 0 1 1 4v2h4v-3a6 6 0 0 0-5-6z" />
      </>
    );
  else if (Outline === Dumbbell)
    shape = (
      <g transform="rotate(-35 12 12)">
        <rect x="1" y="7" width="4" height="10" rx="1" />
        <rect x="5" y="4" width="4" height="16" rx="1" />
        <rect x="9" y="10" width="6" height="4" />
        <rect x="15" y="4" width="4" height="16" rx="1" />
        <rect x="19" y="7" width="4" height="10" rx="1" />
      </g>
    );
  else if (Outline === LayoutGrid)
    shape = (
      <>
        <rect x="2" y="2" width="9" height="9" rx="2" />
        <rect x="13" y="2" width="9" height="9" rx="2" />
        <rect x="2" y="13" width="9" height="9" rx="2" />
        <rect x="13" y="13" width="9" height="9" rx="2" />
      </>
    );
  else if (Outline === ClipboardList)
    shape = (
      <path
        fillRule="evenodd"
        d="M8 2h8v3H8zm-3 1h1v4h12V3h1a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm1 7v2h2v-2zm4 0v2h8v-2zm-4 5v2h2v-2zm4 0v2h8v-2zm-4 5v2h2v-2zm4 0v2h8v-2z"
      />
    );
  else if (Outline === BookOpen)
    shape = <path d="M2 3c4-1 7 0 9 2v17c-3-2-6-3-10-2V4zm20 0c-4-1-7 0-9 2v17c3-2 6-3 10-2V4z" />;
  else if (Outline === Salad)
    shape = (
      <>
        <path d="M2 12h20c0 6-4 10-10 10S2 18 2 12zM4 10C0 4 7 0 10 7l1 3zm7 0C7 2 15-1 16 5c6-4 9 3 3 5z" />
      </>
    );
  else if (Outline === Settings)
    shape = (
      <path
        fillRule="evenodd"
        d="m10 1-1 3-3 1-3-1-2 4 2 2v4l-2 2 2 4 3-1 3 1 1 3h4l1-3 3-1 3 1 2-4-2-2v-4l2-2-2-4-3 1-3-1-1-3zm2 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8"
      />
    );
  else if (Outline === Moon)
    shape = <path d="M21 15.4A9.5 9.5 0 0 1 8.6 3a10 10 0 1 0 12.4 12.4Z" />;
  else if (Outline === Sun)
    shape = (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M11 0h2v4h-2zm0 20h2v4h-2zM0 11h4v2H0zm20 0h4v2h-4zM3 2l3 3-1 2-3-3zm15 15 4 4-1 1-4-4zM2 21l4-4 1 1-4 4zM17 6l4-4 1 1-4 4z" />
      </>
    );
  else if (Outline === LogOut)
    shape = (
      <>
        <path d="M3 2h9v4H7v12h5v4H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
        <path d="m16 5 7 7-7 7v-5H9v-4h7Z" />
      </>
    );
  else return <Outline className={className} />;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      className={className}
    >
      {shape}
    </svg>
  );
}
