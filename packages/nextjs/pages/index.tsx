import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useDarkMode } from "usehooks-ts";
import { CopyIcon } from "~~/public/icons/CopyIcon";
import { UserPlaceholder } from "~~/public/icons/UserPlaceholder";
import { Logo } from "~~/public/logo";

const NetworkCard = () => {
  return (
    <div className="px-2 py-1 bg-secondary flex gap-2 items-center text-primary-content rounded-md">
      <span>Network:</span>
      <div className="flex gap-1">
        <div className="h-6 w-6 overflow-hidden">
          <Image src="/networks/polygon.svg" alt="polygon" className="h-full w-full" width={24} height={24} />
        </div>
        <span>Polygon</span>
      </div>
    </div>
  );
};

const Logout = () => {
  return (
    <div>
      <span>Logout</span>
    </div>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  //const isActive = href === window.location.pathname;
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <div
      className={`px-2 py-1 hover:bg-secondary rounded-md hover:text-primary ${isActive && "font-bold"} ${
        isActive && "bg-secondary"
      } ${isActive && "text-primary"}`}
    >
      <Link href={href}>{children}</Link>
    </div>
  );
};

const Nav = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <nav className="w-full flex justify-between items-center">
      <div className="flex items-center gap-16">
        <div>
          <Logo color={isDarkMode ? "#f6f6f6" : "#021504"} />
        </div>
        <div className="flex gap-10">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/employees">Employees</NavLink>
        </div>
      </div>
      <div className="flex items-center gap-10">
        <NetworkCard />
        <Logout />
      </div>
    </nav>
  );
};

const CopyableText = ({ children, copyText }: { children: React.ReactNode; copyText: string }) => {
  function copyToClipboard() {
    navigator.clipboard.writeText(copyText);
  }

  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={copyToClipboard}>
      {children}
      <div>
        <CopyIcon />
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="flex gap-4 items-end">
      <div>
        <UserPlaceholder />
      </div>
      <div>
        <CopyableText copyText="0x">
          <span>
            <strong>Main Address:</strong> 0x1234567890
          </span>
        </CopyableText>
        <span className="mt-2 text-xl">Company Name</span>
      </div>
    </div>
  );
};

const TokenBalance = ({ amount, token }: { amount: number; token: string }) => {
  const tokenPrice = 1;
  const amountInUSD = amount * tokenPrice;
  return (
    <div className="bg-secondary px-2 py-1 flex gap-4 items-center text-primary-content rounded-[0.25rem]">
      <div>
        <Image src={`/tokens/${token}.svg`} alt={token} width={24} height={24} />
      </div>
      <div className="flex flex-col">
        <span className="font-bold">
          {amount} {token}
        </span>
        <span className="text-sm opacity-60">${amountInUSD}</span>
      </div>
    </div>
  );
};

const MainBalance = () => {
  return (
    <div className="flex items-center w-full gap-20">
      <div className="flex flex-col">
        <span>Main Balance</span>
        <span className="text-2xl">$100,000.00</span>
      </div>
      <div className="flex gap-8">
        <TokenBalance amount={80000} token={"usdc"} />
        <TokenBalance amount={10.56} token={"eth"} />
      </div>
    </div>
  );
};

const Button = ({ icon, children }: { icon?: any; children: React.ReactNode }) => {
  return (
    <button className="bg-primary px-12 py-5 rounded-full text-white">
      {icon && <div>{icon}</div>}
      <span className="leading-none">{children}</span>
    </button>
  );
};

const ChildCard = ({ balance }: { balance: number }) => {
  return (
    <div className="bg-gradient-to-b from-[rgba(8,25,234,1)] to-[rgba(201,206,255,1)] rounded-lg p-4 flex flex-col justify-between h-[12rem] text-white">
      <CopyableText copyText="0x">0x...123</CopyableText>
      <div className="flex justify-between w-full items-center text-primary-content">
        <div>
          <span className="text-sm">Owner</span>
          <div className="flex items-center gap-2 mt-2">
            <UserPlaceholder />
            <span className="text-lg">John Doe</span>
          </div>
        </div>
        <span>{balance}</span>
      </div>
    </div>
  );
};

const Employees = () => {
  return (
    <div className="w-full">
      <div className="w-full items-center flex justify-between">
        <span className="text-xl">Employees (8)</span>
        <Button>Add Employee</Button>
      </div>
      <div className="grid grid-cols-3 gap-10 mt-10">
        <ChildCard balance={400} />
        <ChildCard balance={400} />
        <ChildCard balance={400} />
        <ChildCard balance={400} />
      </div>
    </div>
  );
};

const Spacer = ({ height }: { height: number }) => {
  return <div style={{ height: `${height}rem` }} />;
};

const Dashboard = () => {
  return (
    <div className="bg-base-300 px-12 py-8 rounded-2xl overflow-hidden h-full">
      <Nav />
      <Spacer height={3} />
      <Header />
      <Spacer height={3} />
      <MainBalance />
      <Spacer height={3} />
      <Employees />
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <div className="bg-brand-gray-darker pt-10 px-20 h-full">
        <Dashboard />
      </div>
    </>
  );
};

export default Home;
