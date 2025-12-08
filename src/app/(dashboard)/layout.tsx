import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { CurrencyProvider } from "@/providers/currency-provider";
import { FilterProvider } from "@/providers/filter-provider";
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
      <FilterProvider>
        <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
          {/* Skip link for keyboard navigation */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg"
          >
            Skip to main content
          </a>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main id="main-content" className="flex-1 p-6" tabIndex={-1}>
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </FilterProvider>
    </CurrencyProvider>
  );
}
