"use client";

type BadgeProps = {
  text: string;
  variant: "warning" | "success" | "info";
};

const VARIANT_TO_BG: Record<BadgeProps["variant"], string> = {
  warning: "bg-red-200",
  info: "bg-gray-100",
  success: "bg-green-200",
} as const;

export const Badge = ({ text, variant }: BadgeProps) => {
  return (
    <span className={`rounded-xl px-2 h-fit text-sm ${VARIANT_TO_BG[variant]}`}>
      {text}
    </span>
  );
};
