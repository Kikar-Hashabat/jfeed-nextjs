"use client";

import React, { useEffect, useRef } from "react";

interface WidgetAttrs {
  "data-src"?: string;
  "data-widget-id"?: string;
  "data-ob-user-id"?: string;
  "data-ob-installation-key"?: string;
  "data-ob-installation-type"?: string;
  "data-ob-app-ver"?: string;
  "data-is-secured"?: string;
  "data-ob-contenturl"?: string;
  "data-ob-portalurl"?: string;
  "data-ob-bundleurl"?: string;
  "data-ob-language"?: string;
  "data-ob-psub"?: string;
  "data-ob-app-id"?: string;
  "data-external-id"?: string;
  "data-dark-mode"?: string;
}

interface OutbrainWidgetProps {
  dataWidgetId: string;
  obUserId?: string;
  obInstallationKey?: string;
  obInstallationType?: string;
  obAppVer?: string;
  isSecured?: string;
  obContentUrl?: string | null;
  obPortalUrl?: string | null;
  obBundleUrl?: string | null;
  obLanguage?: string | null;
  obPsub?: string | null;
  obAppId?: string | null;
  externalId?: string | null;
  obDarkMode?: string | null;
}

interface WindowWithOBR extends Window {
  OBR?: {
    extern?: {
      renderSpaWidgets?: (url: string) => void;
    };
  };
}

const removeNullOrEmpty = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  return Object.keys(obj).reduce((acc: Partial<T>, key: string) => {
    if (obj[key as keyof T] !== null && obj[key as keyof T] !== "") {
      acc[key as keyof T] = obj[key as keyof T];
    }
    return acc;
  }, {});
};

const WidgetContainer: React.FC<{ attrs: WidgetAttrs }> = ({ attrs }) => (
  <div className="OUTBRAIN" {...attrs} />
);

const OutbrainWidget: React.FC<OutbrainWidgetProps> = React.memo(
  ({
    dataWidgetId,
    obUserId = "",
    obInstallationKey = "",
    obInstallationType = "",
    obAppVer = "",
    isSecured = "",
    obContentUrl = null,
    obPortalUrl = null,
    obBundleUrl = null,
    obLanguage = null,
    obPsub = null,
    obAppId = null,
    externalId = null,
    obDarkMode = null,
  }) => {
    const widgetWrapperEl = useRef<HTMLDivElement>(null);
    const dataSrc = process.env.NEXT_PUBLIC_WEBSITE_URL;

    const attrs: WidgetAttrs = removeNullOrEmpty({
      "data-src": dataSrc,
      "data-widget-id": dataWidgetId,
      "data-ob-user-id": obUserId,
      "data-ob-installation-key": obInstallationKey,
      "data-ob-installation-type": obInstallationType,
      "data-ob-app-ver": obAppVer,
      "data-is-secured": isSecured,
      "data-ob-contenturl": obContentUrl || undefined,
      "data-ob-portalurl": obPortalUrl || undefined,
      "data-ob-bundleurl": obBundleUrl || undefined,
      "data-ob-language": obLanguage || undefined,
      "data-ob-psub": obPsub || undefined,
      "data-ob-app-id": obAppId || undefined,
      "data-external-id": externalId || undefined,
      "data-dark-mode": obDarkMode || undefined,
    });

    const permalink = dataSrc || obContentUrl || obPortalUrl || obBundleUrl;

    const isContainerMarked = (): boolean => {
      const el = widgetWrapperEl.current;
      if (!el) return false;
      const widgetContainer = el.querySelector<HTMLDivElement>(".OUTBRAIN");
      return widgetContainer
        ? !!widgetContainer.getAttribute("data-ob-mark")
        : false;
    };

    const callRenderSpaWidgets = (url: string) => {
      const { OBR } = window as WindowWithOBR;

      if (
        OBR &&
        OBR.extern &&
        typeof OBR.extern.renderSpaWidgets === "function"
      ) {
        OBR.extern.renderSpaWidgets(url);
      }
    };

    const ensureScriptLoaded = () => {
      const scriptId = "outbrain-widget-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src = "https://widgets.outbrain.com/outbrain.js";
        document.head.appendChild(script);
      }
    };

    useEffect(() => {
      ensureScriptLoaded();
      if (isContainerMarked()) return; // stop if container was already found
      if (permalink) {
        callRenderSpaWidgets(permalink);
      }
    }, [attrs, permalink]);

    return (
      <div ref={widgetWrapperEl} className="OB-REACT-WRAPPER">
        <WidgetContainer key={Date.now()} attrs={attrs} />
      </div>
    );
  }
);

OutbrainWidget.displayName = "OutbrainWidget";

export { OutbrainWidget };
