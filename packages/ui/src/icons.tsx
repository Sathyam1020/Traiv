import {
  IconActivity,
  IconAdjustmentsHorizontal,
  IconAlertCircle,
  IconAlertOctagon,
  IconAlertTriangle,
  IconApple,
  IconArrowLeft,
  IconArrowRight,
  IconBarbell,
  IconBasket,
  IconBolt,
  IconBook,
  IconCake,
  IconCalculator,
  IconCalendar,
  IconCalendarCheck,
  IconCamera,
  IconChartArea,
  IconChartBar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircle,
  IconCircleCheck,
  IconCircleOff,
  IconClipboardList,
  IconClock,
  IconCopy,
  IconCreditCard,
  IconCurrencyRupee,
  IconDeviceMobile,
  IconDots,
  IconDotsVertical,
  IconDownload,
  IconDroplets,
  IconExternalLink,
  IconFileText,
  IconFlame,
  IconFolder,
  IconGenderBigender,
  IconGripVertical,
  IconHeartRateMonitor,
  IconHome,
  IconHourglass,
  IconInbox,
  IconInfinity,
  IconInfoCircle,
  IconLayoutGrid,
  IconLayoutSidebarLeftCollapse,
  IconList,
  IconLoader2,
  IconLock,
  IconLogout,
  IconMeat,
  IconMenu2,
  IconMessage,
  IconMessageCircle,
  IconMinus,
  IconMoon,
  IconNotes,
  IconPalette,
  IconPencil,
  IconPhoto,
  IconPlayerPause,
  IconPlayerPauseFilled,
  IconPlayerPlay,
  IconPlayerSkipForward,
  IconPlus,
  IconQuote,
  IconRefresh,
  IconRepeat,
  IconRuler2,
  IconSalad,
  IconScale,
  IconScaleOutline,
  IconScan,
  IconSearch,
  IconSelector,
  IconSettings,
  IconShieldCheck,
  IconSnowflake,
  IconSortAscending,
  IconSparkles,
  IconStar,
  IconSun,
  IconTag,
  IconToolsKitchen2,
  IconTrash,
  IconTrendingDown,
  IconTrendingUp,
  IconUpload,
  IconUser,
  IconUsers,
  IconVideo,
  IconVolume,
  IconVolumeOff,
  IconWheat,
  IconWorld,
  IconX,
  type IconProps as TablerIconProps,
} from "@tabler/icons-react";
import type * as React from "react";

/** Central Tabler icon adapter. Existing screen imports, sizing and colors stay stable. */
export type IconProps = TablerIconProps;
export type Icon = ((props: IconProps) => React.JSX.Element) & { displayName?: string };

function icon(Svg: React.ElementType<TablerIconProps>, name: string): Icon {
  const Component = (props: IconProps) => <Svg aria-hidden="true" stroke={1.8} {...props} />;
  Component.displayName = name;
  return Component;
}

export const Home = icon(IconHome, "Home");
export const Users = icon(IconUsers, "Users");
export const User = icon(IconUser, "User");
export const Settings = icon(IconSettings, "Settings");
export const Inbox = icon(IconInbox, "Inbox");
export const LayoutGrid = icon(IconLayoutGrid, "LayoutGrid");
export const BarChart = icon(IconChartBar, "BarChart");
export const ChartArea = icon(IconChartArea, "ChartArea");
export const Menu = icon(IconMenu2, "Menu");
export const PanelLeft = icon(IconLayoutSidebarLeftCollapse, "PanelLeft");
export const LogOut = icon(IconLogout, "LogOut");
export const ArrowLeft = icon(IconArrowLeft, "ArrowLeft");
export const ArrowRight = icon(IconArrowRight, "ArrowRight");
export const ChevronLeft = icon(IconChevronLeft, "ChevronLeft");
export const ChevronRight = icon(IconChevronRight, "ChevronRight");
export const ChevronDown = icon(IconChevronDown, "ChevronDown");
export const ChevronUp = icon(IconChevronUp, "ChevronUp");
export const ChevronsUpDown = icon(IconSelector, "ChevronsUpDown");
export const Zap = icon(IconBolt, "Zap");
export const ShoppingBasket = icon(IconBasket, "ShoppingBasket");
export const Barcode = icon(IconScan, "Barcode");
export const Camera = icon(IconCamera, "Camera");
export const Minus = icon(IconMinus, "Minus");
export const Plus = icon(IconPlus, "Plus");
export const Pencil = icon(IconPencil, "Pencil");
export const Trash = icon(IconTrash, "Trash");
export const Copy = icon(IconCopy, "Copy");
export const Download = icon(IconDownload, "Download");
export const Search = icon(IconSearch, "Search");
export const RefreshCw = icon(IconRefresh, "RefreshCw");
export const MoreHorizontal = icon(IconDots, "MoreHorizontal");
export const X = icon(IconX, "X");
export const Check = icon(IconCheck, "Check");
export const CircleCheck = icon(IconCircleCheck, "CircleCheck");
export const CircleAlert = icon(IconAlertCircle, "CircleAlert");
export const TriangleAlert = icon(IconAlertTriangle, "TriangleAlert");
export const CircleSlash = icon(IconCircleOff, "CircleSlash");
export const Circle = icon(IconCircle, "Circle");
export const Loader = icon(IconLoader2, "Loader");
export const Lock = icon(IconLock, "Lock");
export const ShieldCheck = icon(IconShieldCheck, "ShieldCheck");
export const Pause = icon(IconPlayerPause, "Pause");
export const Play = icon(IconPlayerPlay, "Play");
export const PauseCircle = icon(IconPlayerPauseFilled, "PauseCircle");
export const Hourglass = icon(IconHourglass, "Hourglass");
export const Snowflake = icon(IconSnowflake, "Snowflake");
export const Unlimited = icon(IconInfinity, "Unlimited");
export const Activity = icon(IconActivity, "Activity");
export const Apple = icon(IconApple, "Apple");
export const CalendarDays = icon(IconCalendar, "CalendarDays");
export const Clock = icon(IconClock, "Clock");
export const Dumbbell = icon(IconBarbell, "Dumbbell");
export const FileText = icon(IconFileText, "FileText");
export const HeartPulse = icon(IconHeartRateMonitor, "HeartPulse");
export const MessageCircle = icon(IconMessageCircle, "MessageCircle");
export const MessageSquareText = icon(IconMessage, "MessageSquareText");
export const Quote = icon(IconQuote, "Quote");
export const Salad = icon(IconSalad, "Salad");
export const Sparkles = icon(IconSparkles, "Sparkles");
export const Star = icon(IconStar, "Star");
export const Tag = icon(IconTag, "Tag");
export const Repeat = icon(IconRepeat, "Repeat");
export const SkipForward = icon(IconPlayerSkipForward, "SkipForward");
export const Volume2 = icon(IconVolume, "Volume2");
export const VolumeX = icon(IconVolumeOff, "VolumeX");
export const Weight = icon(IconScaleOutline, "Weight");
export const Scale = icon(IconScale, "Scale");
export const Ruler = icon(IconRuler2, "Ruler");
export const Cake = icon(IconCake, "Cake");
export const VenusAndMars = icon(IconGenderBigender, "VenusAndMars");
export const Flame = icon(IconFlame, "Flame");
export const TrendingUp = icon(IconTrendingUp, "TrendingUp");
export const TrendingDown = icon(IconTrendingDown, "TrendingDown");
export const CreditCard = icon(IconCreditCard, "CreditCard");
export const IndianRupee = icon(IconCurrencyRupee, "IndianRupee");
export const NotebookPen = icon(IconNotes, "NotebookPen");
export const CircleCheckBig = icon(IconCircleCheck, "CircleCheckBig");
export const BookOpen = icon(IconBook, "BookOpen");
export const Calculator = icon(IconCalculator, "Calculator");
export const CalendarCheck = icon(IconCalendarCheck, "CalendarCheck");
export const ClipboardList = icon(IconClipboardList, "ClipboardList");
export const Palette = icon(IconPalette, "Palette");
export const Smartphone = icon(IconDeviceMobile, "Smartphone");
export const Info = icon(IconInfoCircle, "Info");
export const OctagonX = icon(IconAlertOctagon, "OctagonX");
export const Moon = icon(IconMoon, "Moon");
export const Sun = icon(IconSun, "Sun");
export const Image = icon(IconPhoto, "Image");
export const GripVertical = icon(IconGripVertical, "GripVertical");
export const Video = icon(IconVideo, "Video");
export const Upload = icon(IconUpload, "Upload");
export const Protein = icon(IconMeat, "Protein");
export const Carbs = icon(IconWheat, "Carbs");
export const Fat = icon(IconDroplets, "Fat");
export const MoreVertical = icon(IconDotsVertical, "MoreVertical");
export const Globe = icon(IconWorld, "Globe");
export const Folder = icon(IconFolder, "Folder");
export const Sort = icon(IconSortAscending, "Sort");
export const List = icon(IconList, "List");

export const Utensils = icon(IconToolsKitchen2, "Utensils");
export {
  IconArrowsMaximize as ArrowsMaximize,
  IconClipboardCheck as ClipboardCheck,
  IconMoodHappy as Smile,
} from "@tabler/icons-react";

export const ExternalLink = icon(IconExternalLink, "ExternalLink");
export const SlidersHorizontal = icon(IconAdjustmentsHorizontal, "SlidersHorizontal");

export {
  IconAntennaBars5 as SignalBars,
  IconArrowUpRight as ArrowUpRight,
  IconBattery3 as Battery,
  IconBell as Bell,
  IconFile as File,
  IconLink as Link,
  IconMail as Mail,
  IconMusic as Music,
  IconPuzzle as Puzzle,
  IconSend as Send,
  IconShare as Share,
  IconShoe as Footprints,
} from "@tabler/icons-react";
