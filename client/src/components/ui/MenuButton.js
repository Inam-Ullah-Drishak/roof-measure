import { forwardRef } from "react";

// Hamburger icon that morphs into an X when open
const MenuButton = forwardRef(function MenuButton({ open, onClick, controls, className = "" }, ref) {
  const bar = "absolute left-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-out motion-reduce:transition-none";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Close menu" : "Open menu"}
      className={`relative rounded-md p-2 text-slate-700 hover:bg-slate-100 ${className}`}
    >
      <span className="relative block h-5 w-6" aria-hidden="true">
        <span className={`${bar} ${open ? "top-2.5 rotate-45" : "top-0.5"}`} />
        <span className={`${bar} top-2.5 ${open ? "scale-x-0 opacity-0" : "opacity-100"}`} />
        <span className={`${bar} ${open ? "top-2.5 -rotate-45" : "top-[1.125rem]"}`} />
      </span>
    </button>
  );
});

export default MenuButton;
