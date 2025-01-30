import { getNavigation } from "@/utils/api";
import { ClientNav } from "./ClientNav";

export async function Navigation() {
  const navItems = await getNavigation();
  return <ClientNav items={navItems} />;
}
