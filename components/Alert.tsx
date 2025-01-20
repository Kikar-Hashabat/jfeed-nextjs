"use client";

import React from "react";

interface AlertProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info";
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const getAlertVariantStyles = (variant: AlertProps["variant"] = "default") => {
  const variants = {
    default: "bg-gray-100 border-gray-200 text-gray-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return variants[variant];
};

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variantStyles = getAlertVariantStyles(variant);

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${variantStyles} ${className}`}
    >
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  );
};
