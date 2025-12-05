import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { CurrencyProvider } from "@/providers/currency-provider";
import { auth } from "@/auth";
import { DEFAULT_CURRENCY, CurrencyCode } from "@/lib/currency";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user's currency preference from session
  const session = await auth();
  const userCurrency = ((session?.user as any)?.currencyPreference as CurrencyCode) || DEFAULT_CURRENCY;

  return (
    <CurrencyProvider initialCurrency={userCurrency}>
      <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
        <Footer />
      </div>
    </CurrencyProvider>
  );
}
