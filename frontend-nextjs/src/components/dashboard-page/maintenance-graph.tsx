"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Maintenance } from "@/type/maintenance"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  maintenance: {
    label: "Maintenance",
    theme: {
      light: "#000000",
      dark: "#ffffff",
    },
  },
} satisfies ChartConfig

interface MaintenanceGraphProps {
  maintenanceData: Maintenance[];
}

interface MonthlyData {
  month: string;
  year: number;
  maintenance: number;
}

export function MaintenanceGraph({ maintenanceData }: MaintenanceGraphProps) {
  const chartData = processDataByMonth(maintenanceData);
  
  const trendPercentage = calculateTrend(chartData);
  
  const dateRangeDescription = getDateRangeDescription();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance History</CardTitle>
        <CardDescription>{dateRangeDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="maintenance" fill="var(--color-maintenance)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trendPercentage > 0 ? (
            <>Trending up by {trendPercentage}% this month <TrendingUp className="h-4 w-4" /></>
          ) : trendPercentage < 0 ? (
            <>Trending down by {Math.abs(trendPercentage)}% this month <TrendingUp className="h-4 w-4 rotate-180" /></>
          ) : (
            <>No change from last month</>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total maintenance events for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

function processDataByMonth(data: Maintenance[]): MonthlyData[] {
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 5);
  
  const months: MonthlyData[] = [];
  const currentDate = new Date(sixMonthsAgo);
  
  while (currentDate <= today) {
    months.push({
      month: currentDate.toLocaleString('default', { month: 'long' }),
      year: currentDate.getFullYear(),
      maintenance: 0
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // Count maintenance events by month
  data.forEach(item => {
    const date = new Date(item.date);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    const monthIndex = months.findIndex(m => m.month === monthName && m.year === year);
    if (monthIndex !== -1) {
      months[monthIndex].maintenance++;
    }
  });
  
  return months;
}

// Calculate trend percentage
function calculateTrend(chartData: MonthlyData[]): number {
  if (chartData.length >= 2) {
    const currentMonth = chartData[chartData.length - 1].maintenance;
    const previousMonth = chartData[chartData.length - 2].maintenance;
    
    if (previousMonth > 0) {
      const trend = ((currentMonth - previousMonth) / previousMonth) * 100;
      return parseFloat(trend.toFixed(1));
    }
  }
  return 0;
}

// Get date range description
function getDateRangeDescription(): string {
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 5);
  
  const startMonth = sixMonthsAgo.toLocaleString('default', { month: 'long' });
  const endMonth = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  
  return `${startMonth} - ${endMonth} ${year}`;
}