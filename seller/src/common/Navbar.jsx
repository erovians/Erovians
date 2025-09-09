import { useState } from "react";
import { assets } from "@/assets/assets";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Store, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const components = [
  {
    title: "Payment Cycle",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Fee Type",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Calculate Gross Margin",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <nav className="bg-white shadow-sm border-b h-24 w-full top-0 left-0 z-50  sticky">
      <div className="max-w-full mx-auto px-6 flex justify-between items-center h-full">
        {/* Logo */}
        <div className="flex items-center ">
        <Link to={'/'}> <img src={assets.logo} alt="Logo" className="h-8 w-auto sm:h-8 md:h-8 lg:h-10 xl:h-12" /></Link> 
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base">Sell Online</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild  className="hover:bg-transparent"> 
                       <img src={assets.dashboradimg} alt="Nav-Dahsboard-Image"/>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="Create Account">
                      Creating your Erovians seller account is a quick process, taking less than 10 minutes, and requires only 3 documents.
                    </ListItem>
                    <ListItem href="/docs/installation" title="List Products">
                      List your products to display users .
                    </ListItem>
                    <ListItem
                      href="/docs/primitives/typography"
                      title="Help & Support"
                    >
                      24/7 support to assist you with any questions or issues you may have.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Components */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base">Fee & Commission</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Grow */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base">Grow</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#">
                          <div className="font-medium">E-Assured Badge</div>
                          <div className="text-muted-foreground">
                            Browse all components in the library.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">
                          <div className="font-medium">Insights and Tools</div>
                          <div className="text-muted-foreground">
                            Learn how to use the library.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">
                          <div className="font-medium">Erovians Value Services</div>
                          <div className="text-muted-foreground">
                            Read our latest blog posts.
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Learn */}
              <NavigationMenuItem>
               <Link to={'/learn'}><NavigationMenuTrigger className="text-base">Learn</NavigationMenuTrigger></Link> 
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#">FAQs</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#">Seller Success Stories</Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex h-[60%] justify-between items-center w-1/6 gap-3 mr-25">
          <Button variant="outline" className="bg-transparent h-full w-[60%] border border-navyblue hover:bg-navyblue hover:text-white">
            Login <span><LogIn /></span>
          </Button>
          <Button variant="outline" className="bg-navyblue h-full w-[60%] text-white cursor-pointer hover:bg-navyblue hover:bg-white hover:border-navyblue px-20">
            Start Selling <span><Store /></span>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t shadow-md p-4 space-y-4">
          <ul className="flex flex-col gap-3">
            {/* Home */}
            <MobileDropdown
              title="Sell Online"
              isOpen={openDropdown === "home"}
              onClick={() =>
                setOpenDropdown(openDropdown === "home" ? null : "home")
              }
            >
              <li><Link to="/" className="block">shadcn/ui</Link></li>
              <li><Link to="/docs" className="block">Introduction</Link></li>
              <li><Link to="/docs/installation" className="block">Installation</Link></li>
              <li><Link to="/docs/primitives/typography" className="block">Typography</Link></li>
            </MobileDropdown>

            {/* Components */}
            <MobileDropdown
              title="Components"
              isOpen={openDropdown === "components"}
              onClick={() =>
                setOpenDropdown(openDropdown === "components" ? null : "components")
              }
            >
              {components.map((c) => (
                <li key={c.title}>
                  <Link to={c.href} className="block">{c.title}</Link>
                </li>
              ))}
            </MobileDropdown>

            {/* Grow */}
            <MobileDropdown
              title="Grow"
              isOpen={openDropdown === "grow"}
              onClick={() =>
                setOpenDropdown(openDropdown === "grow" ? null : "grow")
              }
            >
              <li><Link to="#">Components</Link></li>
              <li><Link to="#">Documentation</Link></li>
              <li><Link to="#">Blog</Link></li>
            </MobileDropdown>

            {/* Learn */}
            <MobileDropdown
              title="Learn"
              isOpen={openDropdown === "learn"}
              onClick={() =>
                setOpenDropdown(openDropdown === "learn" ? null : "learn")
              }
            >
              <li><Link to="#">FAQs</Link></li>
              <li><Link to="#">Seller Success Stories</Link></li>
            </MobileDropdown>
          </ul>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <Button variant="outline" className="bg-transparent border border-yellow hover:bg-yellow">
              Login <LogIn />
            </Button>
            <Button variant="outline" className="bg-yellow hover:bg-white hover:border-yellow">
              Start Selling <Store />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* Reusable ListItem (desktop) */
function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

/* Reusable Mobile Dropdown */
function MobileDropdown({ title, isOpen, onClick, children }) {
  return (
    <li>
      <button
        className="w-full flex justify-between items-center font-medium"
        onClick={onClick}
      >
        {title}
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Animated dropdown */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="pl-4 space-y-2">{children}</ul>
      </div>
    </li>
  );
}
