import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // 1. DEFAULT (Nút Quick Sell): Màu Primary nền đặc
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",

        // 2. DESTRUCTIVE: Nút xóa
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",

        // 3. OUTLINE (Nút Add contact): Viền màu Primary, Chữ màu Primary (Khác mặc định Shadcn là viền xám)
        outline:
          "border border-primary text-primary bg-background shadow-sm hover:bg-primary/10",

        // 4. SECONDARY: Nền xám nhẹ
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",

        // 5. GHOST: Nút icon chuông (Bell) hoặc menu
        ghost: "hover:bg-accent hover:text-accent-foreground text-slate-600",

        // 6. LINK: Dạng liên kết
        link: "text-primary underline-offset-4 hover:underline",

        // 7. DARK (Nút dấu cộng + màu đen): Thêm mới cho giống ảnh
        dark: "bg-slate-950 text-white hover:bg-slate-800 shadow-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        // ICON: Vì base là rounded-full nên size vuông sẽ tự thành hình tròn
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
