import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";

export const Toaster = (props) => {
  return (
    <Sonner
      richColors
      closeButton
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          // 👇 base styles
          "--toast-bg": "hsl(0, 0%, 100%)",
          "--toast-text": "hsl(220, 9%, 20%)",
          "--toast-border": "hsl(220, 9%, 90%)",
          "--border-radius": "0.5rem",

          // 👇 rich color overrides
          "--toast-success-bg": "#16a34a",
          "--toast-success-text": "#ffffff",

          "--toast-error-bg": "#dc2626",
          "--toast-error-text": "#ffffff",

          "--toast-warning-bg": "#eab308",
          "--toast-warning-text": "#000000",

          "--toast-info-bg": "#3b82f6",
          "--toast-info-text": "#ffffff",
        }
      }
      {...props}
    />
  );
};
