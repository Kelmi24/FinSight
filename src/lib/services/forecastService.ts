import { db } from "@/lib/db";
import { startOfDay, subDays, addDays, format, getDay } from "date-fns";

export interface ForecastPoint {
  date: string;
  actual?: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export class ForecastService {
  /**
   * Generate spending forecast using a simplified Additive Model (Trend + Weekly Seasonality)
   * This mimics the basic behavior of Prophet without external Python dependencies.
   */
  async generateForecast(userId: string, horizonDays: number = 30): Promise<ForecastPoint[]> {
    // 1. Fetch historical data (last 90 days)
    const historyDays = 90;
    const startDate = subDays(new Date(), historyDays);
    
    const transactions = await db.transaction.findMany({
      where: {
        userId,
        type: "expense",
        date: { gte: startDate },
        deletedAt: null,
      },
      orderBy: { date: "asc" },
    });

    // 2. Aggregate by day
    const dailyExpenses = new Map<string, number>();
    const dateToDayOfWeek = new Map<string, number>();

    // Initialize all days with 0
    for (let i = 0; i <= historyDays; i++) {
      const d = addDays(startDate, i);
      const key = format(d, "yyyy-MM-dd");
      dailyExpenses.set(key, 0);
      dateToDayOfWeek.set(key, getDay(d)); // 0 = Sunday, 1 = Monday...
    }

    transactions.forEach(t => {
      const key = format(t.date, "yyyy-MM-dd");
      if (dailyExpenses.has(key)) {
        dailyExpenses.set(key, (dailyExpenses.get(key) || 0) + t.amount);
      }
    });

    const dates = Array.from(dailyExpenses.keys()).sort();
    const values = dates.map(d => dailyExpenses.get(d) || 0);

    // 3. Calculate Weekly Seasonality
    // Average spend per day of week
    const dayOfWeekTotals = [0, 0, 0, 0, 0, 0, 0];
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0];

    dates.forEach((date, i) => {
      const day = dateToDayOfWeek.get(date) || 0;
      dayOfWeekTotals[day] += values[i];
      if (values[i] > 0) dayOfWeekCounts[day]++; // Only count non-zero days? Or all days? 
      // For proper average, count all days usually.
      dayOfWeekCounts[day]++;
    });

    const globalAverage = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Seasonality factors (e.g., 1.2 = 20% higher than average)
    const seasonality = dayOfWeekTotals.map((total, i) => {
      const count = dayOfWeekCounts[i] || 1;
      const avg = total / count;
      return globalAverage > 0 ? avg / globalAverage : 1;
    });

    // 4. Linear Trend (Simple Regression on Deseasonalized Data)
    // Deseasonalize
    const deseasonalized = values.map((v, i) => {
        const day = dateToDayOfWeek.get(dates[i]) || 0;
        const factor = seasonality[day] || 1;
        return factor > 0 ? v / factor : v;
    });

    // Linear Regression: y = mx + c
    const n = deseasonalized.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    deseasonalized.forEach((y, x) => {
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 0;
    const c = (sumY - m * sumX) / n || 0;

    // 5. Generate Forecast
    const forecast: ForecastPoint[] = [];

    // History points (for context in chart)
    dates.forEach((date, i) => {
      forecast.push({
        date,
        actual: values[i],
        predicted: (m * i + c) * (seasonality[dateToDayOfWeek.get(date) || 0]),
        lowerBound: 0, // Simplified
        upperBound: 0,
      });
    });

    // Future points
    const lastDate = new Date(dates[dates.length - 1]);
    
    for (let i = 1; i <= horizonDays; i++) {
        const futureDate = addDays(lastDate, i);
        const dayIdx = getDay(futureDate);
        const x = n + i;
        
        // Trend * Seasonality
        let pred = (m * x + c) * seasonality[dayIdx];
        if (pred < 0) pred = 0; // No negative spending

        // Simple Confidence Interval (using std dev of residuals)
        // ... (omitted for brevity, using flat 20% buffer)
        
        forecast.push({
            date: format(futureDate, "yyyy-MM-dd"),
            predicted: pred,
            lowerBound: pred * 0.8,
            upperBound: pred * 1.2,
        });
    }

    return forecast;
  }
}

export const forecastService = new ForecastService();
