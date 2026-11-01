"use client";

import * as React from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconCamera, IconUser } from "@tabler/icons-react";
import { cn } from "@traiv/ui/lib/cn";

/** Motion tiers, the same speeds as the --primitive-motion-* tokens. */
const SPRING = {
  fast: { type: "spring", duration: 0.08, bounce: 0 },
  moderate: { type: "spring", duration: 0.16, bounce: 0 },
  slow: { type: "spring", duration: 0.24, bounce: 0 },
} as const;

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "offline" | "away" | "busy";
type AvatarImageStatus = "idle" | "loading" | "loaded" | "error";
type AvatarImageLoadingStatus = Exclude<AvatarImageStatus, "idle">;
export type AvatarFallbackTone =
  | "neutral"
  | "blue"
  | "red"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "sky";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
  status?: AvatarStatus | null;
  /** When true, shows a status ring even without an explicit status value. */
  showStatus?: boolean;
  /** Hover tooltip label anchored above the avatar. */
  tooltip?: React.ReactNode;
  /** Subtle hover affordance on the avatar ring. Defaults to true when `tooltip` is set. */
  interactive?: boolean;
}

export interface AvatarImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "size"> {
  onLoadingStatusChange?: (status: AvatarImageLoadingStatus) => void;
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  delayMs?: number;
  tone?: AvatarFallbackTone;
}

export interface AvatarGroupItemProps {
  name: string;
  children: React.ReactElement<AvatarProps>;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  /** Reveal names on hover without moving the avatar stack. */
  interactive?: boolean;
  children: React.ReactNode;
}

export interface AvatarUploadProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
  size?: AvatarSize;
  src?: string | null;
  alt?: string;
  initials?: string;
  accept?: string;
  disabled?: boolean;
  onChange?: (file: File | null) => void;
  uploadLabel?: string;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const TOOLTIP_SPRING = SPRING.fast;
const TOOLTIP_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const sizeClasses: Record<AvatarSize, string> = {
  xs: "size-6 text-[10px] [&_[data-slot=avatar-status]]:size-1.5 [&_[data-slot=avatar-status]]:ring-[1.5px]",
  sm: "size-8 text-[11px] [&_[data-slot=avatar-status]]:size-2 [&_[data-slot=avatar-status]]:ring-2",
  md: "size-10 text-xs [&_[data-slot=avatar-status]]:size-2.5 [&_[data-slot=avatar-status]]:ring-2",
  lg: "size-12 text-sm [&_[data-slot=avatar-status]]:size-3 [&_[data-slot=avatar-status]]:ring-2",
  xl: "size-16 text-base [&_[data-slot=avatar-status]]:size-3.5 [&_[data-slot=avatar-status]]:ring-[2.5px]",
};

const iconSizes: Record<AvatarSize, string> = {
  xs: "size-3",
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
  xl: "size-6",
};

const groupOverlap: Record<AvatarSize, string> = {
  xs: "-ml-2",
  sm: "-ml-2.5",
  md: "-ml-3",
  lg: "-ml-3.5",
  xl: "-ml-4",
};

const tooltipOffsets: Record<AvatarSize, string> = {
  xs: "bottom-[calc(100%+6px)]",
  sm: "bottom-[calc(100%+7px)]",
  md: "bottom-[calc(100%+8px)]",
  lg: "bottom-[calc(100%+9px)]",
  xl: "bottom-[calc(100%+10px)]",
};

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-[var(--primitive-success)]",
  offline: "bg-[color-mix(in_srgb,var(--muted-foreground)_55%,transparent)]",
  away: "bg-[var(--primitive-warning)]",
  busy: "bg-[var(--primitive-destructive)]",
};

const fallbackTones: Record<AvatarFallbackTone, string> = {
  neutral:
    "bg-[color-mix(in_srgb,var(--foreground)_12%,var(--background))] text-[color-mix(in_srgb,var(--foreground)_82%,var(--background))]",
  blue: "bg-[var(--primitive-chart-1)] text-white",
  emerald: "bg-[var(--primitive-chart-2)] text-white",
  amber: "bg-[var(--primitive-chart-3)] text-white",
  rose: "bg-[var(--primitive-chart-4)] text-white",
  violet: "bg-[var(--primitive-chart-5)] text-white",
  red: "bg-[var(--primitive-chart-6)] text-white",
  /** Manual alias of `blue` — excluded from AUTO_TONES / toneFromSeed. */
  sky: "bg-[var(--primitive-chart-1)] text-white",
};

/** Seed-hashed tones only — one bucket per chart stop, no aliases. */
const AUTO_TONES: AvatarFallbackTone[] = ["blue", "emerald", "amber", "rose", "violet", "red"];

const AVATAR_IMAGE_DISPLAY_NAME = "AvatarImage";

const AvatarContext = React.createContext<{
  size: AvatarSize;
  hasImage: boolean;
  imageStatus: AvatarImageStatus;
  setImageStatus: React.Dispatch<React.SetStateAction<AvatarImageStatus>>;
}>({
  size: "md",
  hasImage: false,
  imageStatus: "idle",
  setImageStatus: () => {},
});

function useAvatarContext() {
  return React.useContext(AvatarContext);
}

function getInitials(value: string) {
  const parts = value
    .trim()
    .split(/[\s@._-]+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toneFromSeed(seed: string): AvatarFallbackTone {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash + seed.charCodeAt(index) * (index + 1)) % AUTO_TONES.length;
  }
  return AUTO_TONES[hash] ?? "blue";
}

function isAvatarImageElement(child: React.ReactNode) {
  if (!React.isValidElement(child)) return false;
  const type = child.type as { displayName?: string };
  return type.displayName === AVATAR_IMAGE_DISPLAY_NAME;
}

function AvatarTooltip({
  label,
  size,
  visible,
  reduceMotion,
}: {
  label: React.ReactNode;
  size: AvatarSize;
  visible: boolean;
  reduceMotion: boolean;
}) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.span
          role="tooltip"
          data-slot="avatar-tooltip"
          initial={reduceMotion ? false : { opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            reduceMotion
              ? undefined
              : {
                  opacity: 0,
                  y: 3,
                  scale: 0.95,
                  transition: { duration: 0.06, ease: TOOLTIP_EASE },
                }
          }
          transition={reduceMotion ? { duration: 0 } : SPRING.fast}
          className={cn(
            "pointer-events-none absolute left-1/2 z-[130] w-max max-w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2",
            tooltipOffsets[size],
          )}
          style={{ transformOrigin: "bottom center" }}
        >
          <span
            data-surface="overlay"
            className={cn(
              "relative inline-flex w-full items-center rounded-[var(--primitive-radius-popup)] px-2.5 py-1.5",
              "break-words text-left",
              "text-[12px] font-medium leading-[1.45] tracking-[-0.01em] text-[var(--foreground)]",
            )}
          >
            {label}
          </span>
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

function AvatarStatusDot({ status }: { status: AvatarStatus }) {
  return (
    <span
      data-slot="avatar-status"
      aria-hidden="true"
      className={cn(
        "absolute bottom-0 right-0 z-10 rounded-full ring-[var(--background)]",
        statusColors[status],
      )}
    >
      {status === "online" ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[var(--primitive-success)]/35 motion-safe:animate-[wensity-avatar-online-pulse_2.4s_ease-in-out_infinite]"
        />
      ) : null}
    </span>
  );
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      className,
      size = "md",
      status = null,
      showStatus = false,
      tooltip,
      interactive,
      children,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion() ?? false;
    const [revealed, setRevealed] = React.useState(false);
    const hasImage = React.Children.toArray(children).some(isAvatarImageElement);
    const [imageStatus, setImageStatus] = React.useState<AvatarImageStatus>(() =>
      hasImage ? "loading" : "idle",
    );
    const resolvedStatus = showStatus && !status ? "online" : status;
    const isInteractive = interactive ?? Boolean(tooltip);

    // Children can gain or lose an <AvatarImage/> between renders. Re-derive
    // during render rather than in an effect, which used to paint one frame of
    // the previous status (a stale "idle" fallback flash) before correcting.
    const [lastHasImage, setLastHasImage] = React.useState(hasImage);
    if (hasImage !== lastHasImage) {
      setLastHasImage(hasImage);
      setImageStatus((current) => {
        if (!hasImage) return "idle";
        return current === "idle" ? "loading" : current;
      });
    }

    const contextValue = React.useMemo(
      () => ({
        size,
        hasImage,
        imageStatus,
        setImageStatus,
      }),
      [hasImage, imageStatus, size],
    );

    return (
      <AvatarContext.Provider value={contextValue}>
        <span
          ref={ref}
          data-slot="avatar-root"
          className={cn(
            "group/avatar-root relative inline-flex align-middle",
            isInteractive && "cursor-default",
            className,
          )}
          tabIndex={tooltip ? 0 : undefined}
          onMouseEnter={() => setRevealed(true)}
          onMouseLeave={() => setRevealed(false)}
          onFocus={(event) => {
            setRevealed(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setRevealed(false);
            onBlur?.(event);
          }}
          {...rest}
        >
          <span
            data-wensity-primitive=""
            data-slot="avatar"
            data-size={size}
            className={cn("relative inline-flex shrink-0 align-middle", sizeClasses[size])}
          >
            <BaseAvatar.Root
              className={cn(
                "relative flex size-full overflow-hidden rounded-full",
                "bg-[color-mix(in_srgb,var(--foreground)_6%,var(--background))]",
                "ring-1 ring-inset ring-[color-mix(in_srgb,var(--foreground)_12%,transparent)]",
              )}
            >
              {children}
            </BaseAvatar.Root>
            {resolvedStatus ? <AvatarStatusDot status={resolvedStatus} /> : null}
          </span>
          {tooltip ? (
            <AvatarTooltip
              label={tooltip}
              size={size}
              visible={revealed}
              reduceMotion={reduceMotion}
            />
          ) : null}
        </span>
      </AvatarContext.Provider>
    );
  },
);
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, alt = "", onLoadingStatusChange, src, ...props }, ref) => {
    const { setImageStatus } = useAvatarContext();
    const reduceMotion = useReducedMotion() ?? false;

    return (
      <BaseAvatar.Image
        ref={ref}
        src={src}
        alt={alt}
        data-slot="avatar-image"
        className={cn(
          "absolute inset-0 size-full object-cover",
          "transition-opacity duration-[var(--primitive-motion-moderate)] ease-[var(--primitive-ease,cubic-bezier(0.16,1,0.3,1))]",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          reduceMotion && "transition-none",
          className,
        )}
        onLoadingStatusChange={(status) => {
          setImageStatus(status);
          if (status !== "idle") onLoadingStatusChange?.(status);
        }}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = AVATAR_IMAGE_DISPLAY_NAME;

export const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, delayMs = 0, tone, children }, ref) => {
    const { size } = useAvatarContext();
    const seed = typeof children === "string" ? children : "";
    const resolvedTone = tone ?? (seed ? toneFromSeed(seed) : "neutral");
    const content = seed ? getInitials(seed) : children;

    return (
      <BaseAvatar.Fallback
        ref={ref}
        delay={delayMs}
        data-slot="avatar-fallback"
        data-tone={resolvedTone}
        className={cn(
          "absolute inset-0 flex size-full items-center justify-center font-semibold tracking-[-0.02em]",
          fallbackTones[resolvedTone],
          className,
        )}
      >
        {content ?? <IconUser className={iconSizes[size]} stroke={1.75} aria-hidden />}
      </BaseAvatar.Fallback>
    );
  },
);
AvatarFallback.displayName = "AvatarFallback";

export function AvatarGroupItem({ children }: AvatarGroupItemProps) {
  return children;
}
AvatarGroupItem.displayName = "AvatarGroupItem";

function isAvatarGroupItem(
  child: React.ReactNode,
): child is React.ReactElement<AvatarGroupItemProps> {
  if (!React.isValidElement(child)) return false;
  const type = child.type as { displayName?: string };
  return type.displayName === "AvatarGroupItem";
}

function resolveGroupAvatar(child: React.ReactNode, interactive: boolean) {
  if (isAvatarGroupItem(child)) {
    const avatar = child.props.children;
    if (!interactive) {
      return React.cloneElement(avatar, {
        tooltip: undefined,
        interactive: false,
      });
    }
    return React.cloneElement(avatar, {
      tooltip: avatar.props.tooltip ?? child.props.name,
      interactive: avatar.props.interactive ?? true,
    });
  }
  return child;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, size = "md", interactive = true, children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const avatars = childArray.map((child) => resolveGroupAvatar(child, interactive));
    const visible = avatars.slice(0, max);
    const overflow = avatars.length - max;

    return (
      <div
        ref={ref}
        data-slot="avatar-group"
        className={cn("inline-flex items-center", interactive && "group/avatar-group", className)}
        {...props}
      >
        {visible.map((child, index) => (
          <div
            key={index}
            data-slot="avatar-group-item"
            className={cn("relative", index > 0 && groupOverlap[size])}
            style={{ zIndex: visible.length - index }}
          >
            {React.isValidElement<{ size?: AvatarSize }>(child)
              ? React.cloneElement(child, { size: child.props.size ?? size })
              : child}
          </div>
        ))}
        {overflow > 0 ? (
          <div className={cn("relative", groupOverlap[size])}>
            <Avatar
              size={size}
              tooltip={interactive ? `+${overflow} more` : undefined}
              interactive={interactive}
            >
              <AvatarFallback tone="neutral" className="text-[11px] font-medium">
                +{overflow}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : null}
      </div>
    );
  },
);
AvatarGroup.displayName = "AvatarGroup";

export const AvatarUpload = React.forwardRef<HTMLLabelElement, AvatarUploadProps>(
  (
    {
      className,
      size = "lg",
      src,
      alt = "Profile photo",
      initials,
      accept = "image/*",
      disabled = false,
      onChange,
      uploadLabel = "Upload profile photo",
      children,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion() ?? false;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const localPreviewRef = React.useRef<string | null>(null);
    const [preview, setPreview] = React.useState<string | null>(src ?? null);
    const [hovered, setHovered] = React.useState(false);
    const revokeLocalPreview = React.useCallback(() => {
      if (!localPreviewRef.current) return;
      URL.revokeObjectURL(localPreviewRef.current);
      localPreviewRef.current = null;
    }, []);

    // A new `src` prop supersedes any locally picked file. Reset during render
    // so the <img> never paints the stale preview for a frame; revoking the
    // old object URL is a genuine side effect, so it stays in an effect keyed
    // to the same change.
    const [lastSrc, setLastSrc] = React.useState(src);
    if (src !== lastSrc) {
      setLastSrc(src);
      setPreview(src ?? null);
    }

    React.useEffect(() => {
      revokeLocalPreview();
    }, [revokeLocalPreview, src]);

    React.useEffect(() => revokeLocalPreview, [revokeLocalPreview]);

    return (
      <label
        ref={ref}
        data-slot="avatar-upload"
        aria-label={uploadLabel}
        className={cn(
          "group/avatar-upload relative inline-flex cursor-pointer align-middle",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        {...props}
      >
        <Avatar size={size} interactive={false}>
          {preview ? (
            <AvatarImage src={preview} alt={alt} />
          ) : (
            <AvatarFallback delayMs={0} tone={initials ? toneFromSeed(initials) : "neutral"}>
              {initials ?? <IconUser stroke={1.75} />}
            </AvatarFallback>
          )}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center rounded-full text-white"
            initial={false}
            animate={{
              backgroundColor: hovered ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
            }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.08, ease: EASE_OUT }}
          >
            <motion.span
              animate={{
                opacity: hovered ? 1 : 0,
                y: hovered ? 0 : 4,
                scale: hovered ? 1 : 0.92,
              }}
              transition={reduceMotion ? { duration: 0 } : TOOLTIP_SPRING}
            >
              <IconCamera className={iconSizes[size]} stroke={1.75} />
            </motion.span>
          </motion.span>
        </Avatar>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            if (file) {
              const objectUrl = URL.createObjectURL(file);
              revokeLocalPreview();
              localPreviewRef.current = objectUrl;
              setPreview(objectUrl);
            } else {
              revokeLocalPreview();
              setPreview(src ?? null);
            }
            onChange?.(file);
          }}
        />
        {children}
      </label>
    );
  },
);
AvatarUpload.displayName = "AvatarUpload";

const AVATAR_STYLE_ID = "wensity-avatar-styles-v2";

function ensureAvatarStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(AVATAR_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = AVATAR_STYLE_ID;
  style.textContent = `
    @keyframes wensity-avatar-online-pulse {
      0%, 100% { transform: scale(1); opacity: 0.35; }
      50% { transform: scale(1.85); opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      [data-slot="avatar-status"] .motion-safe\\:animate-\\[wensity-avatar-online-pulse_2\\.4s_ease-in-out_infinite\\] {
        animation: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

if (typeof document !== "undefined") {
  ensureAvatarStyles();
}
