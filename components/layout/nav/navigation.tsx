import { getNavigation } from "@/utils/api";
import { ClientNav } from "./ClientNav";

export async function Navigation() {
  const navItems = await getNavigation();

  return (
    <header className="fixed top-0 z-50 w-full bg-red-600 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <ClientNav items={navItems} />
        </div>
      </div>
    </header>
  );
}
