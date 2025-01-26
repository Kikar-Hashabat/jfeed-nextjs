export interface NavItem {
  label: string;
  href: string;
}

export interface WeatherInfo {
  location: string;
  temperature: number;
}

export interface ContactInfo {
  icon: string;
  text: string;
}

import * as React from "react";

interface NavLinkProps {
  label: string;
  active?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({ label, active }) => {
  return (
    <div className="overflow-hidden gap-2.5 self-stretch px-4 border-l-[5px] border-zinc-800">
      {label}
    </div>
  );
};

interface TopBarProps {
  contactInfo: ContactInfo;
  weatherInfo: WeatherInfo;
}

export const TopBar: React.FC<TopBarProps> = ({ contactInfo, weatherInfo }) => {
  return (
    <div className="flex gap-3.5 self-stretch my-auto">
      <div className="flex gap-1.5 items-center">
        <img
          loading="lazy"
          src={contactInfo.icon}
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          alt=""
        />
        <div className="self-stretch my-auto">{contactInfo.text}</div>
      </div>
      <div className="flex gap-1.5 items-center">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/1dc230aa085f85745254182ea30afc5dddeda40e8676497eaa810b1ceb15d29b?placeholderIfAbsent=true&apiKey=e55a873632734804aad12f91fcab7943"
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          alt=""
        />
        <div className="self-stretch my-auto">
          {weatherInfo.location} | {weatherInfo.temperature}°
        </div>
      </div>
    </div>
  );
};

const mainNavItems: NavItem[] = [
  { label: "news", href: "/news" },
  { label: "jewish world", href: "/jewish-world" },
  { label: "haredim", href: "/haredim" },
  { label: "opinions", href: "/opinions" },
  { label: "culture", href: "/culture" },
  { label: "finance", href: "/finance" },
];

const sideNavItems: NavItem[] = [
  { label: "news", href: "/news" },
  { label: "jewish world", href: "/jewish-world" },
  { label: "haredim", href: "/haredim" },
  { label: "opinions", href: "/opinions" },
];

export const Navigation: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center w-full text-base font-medium leading-none text-right bg-white min-h-[119px] shadow-[0px_4px_50px_rgba(0,0,0,0.09)] max-md:max-w-full">
        <div className="flex overflow-hidden flex-wrap gap-5 justify-between items-center px-12 py-5 w-full text-white bg-red-700 max-md:px-5 max-md:max-w-full">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1d4d088acbb8d1167ab2b2370357f8f15dc5ff73cb380a4b55b9dd30a702eca3?placeholderIfAbsent=true&apiKey=e55a873632734804aad12f91fcab7943"
            className="object-contain shrink-0 self-stretch my-auto aspect-[2.5] w-[75px]"
            alt=""
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/89fa2aa580d619410324b24743a2f7cb3c75d79c005332a14d21a43905e0444f?placeholderIfAbsent=true&apiKey=e55a873632734804aad12f91fcab7943"
            className="object-contain shrink-0 self-stretch max-w-full aspect-[3.73] w-[127px]"
            alt=""
          />
          <TopBar
            contactInfo={{
              icon:
                "https://cdn.builder.io/api/v1/image/assets/TEMP/d8db723be50aed8256e9679af817187d35efa200b13bffe902cec45744ecf754?placeholderIfAbsent=true&apiKey=e55a873632734804aad12f91fcab7943",
              text: "Contact us",
            }}
            weatherInfo={{ location: "Washington", temperature: 21 }}
          />
        </div>
        <div className="flex flex-col justify-center items-center px-16 py-4 max-w-full text-zinc-800 w-[1192px] max-md:px-5">
          <div className="flex flex-wrap gap-8 items-center max-md:max-w-full">
            {mainNavItems.map((item) => (
              <div key={item.href} className="self-stretch my-auto">
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="self-stretch w-full min-h-0 border border-solid border-neutral-200 max-md:max-w-full" />
      </div>
      <div className="flex overflow-hidden flex-col justify-between items-start pt-12 pl-12 ml-14 text-base font-black leading-none uppercase bg-white border border-solid border-neutral-200 min-h-[651px] shadow-[0px_4px_50px_rgba(0,0,0,0.09)] text-zinc-800 w-[26px] max-md:pl-5 max-md:ml-2.5">
        <div className="flex overflow-hidden flex-wrap gap-12 items-start w-full min-h-[346px]">
          {sideNavItems.map((item) => (
            <div
              key={item.href}
              className="flex flex-col justify-center items-start whitespace-nowrap"
            >
              <NavLink label={item.label} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
