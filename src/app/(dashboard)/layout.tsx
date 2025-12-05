import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { CurrencyProvider } from "@/providers/currency-provider";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DEFAULT_CURRENCY } from "@/lib/currency";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user's currency preference
  const session = await auth();
  let currencyPreference = DEFAULT_CURRENCY;
  
  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { currencyPreference: true },
    });
    if (user?.currencyPreference) {
      currencyPreference = user.currencyPreference as typeof DEFAULT_CURRENCY;
    }
  }

  return (
    <CurrencyProvider initialCurrency={currencyPreference}>
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
