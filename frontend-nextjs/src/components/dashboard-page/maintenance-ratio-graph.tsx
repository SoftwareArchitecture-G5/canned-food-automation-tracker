"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
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

interface MaintenanceRatioGraphProps {
  maintenanceData: Maintenance[];
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

const fallbackColors = [
  "#4299E1",
  "#48BB78",
  "#ECC94B",
  "#F56565",
  "#9F7AEA",
  "#38B2AC",
];

export function MaintenanceRatioGraph({ maintenanceData = [] }: MaintenanceRatioGraphProps) {
  const { chartData, chartConfig, totalMaintenance } = React.useMemo(() => {
    const automationCounts: Record<string, number> = {};
    
    const validData = maintenanceData.filter(item => 
      item && item.automation && item.automation.name
    );
    
    validData.forEach(item => {
      const automationName = item.automation.name;
      automationCounts[automationName] = (automationCounts[automationName] || 0) + 1;
    });
    
    let pieData = Object.entries(automationCounts).map(([name, count]) => ({
      system: name,
      maintenance: count,
      fill: ""
    }));
    
    if (pieData.length === 0) {
      pieData = [{ system: "No Data", maintenance: 1, fill: fallbackColors[0] }];
    }
    
    pieData.sort((a, b) => b.maintenance - a.maintenance);
    
    if (pieData.length > 5) {
      const topSystems = pieData.slice(0, 4);
      const otherSystems = pieData.slice(4);
      
      const otherCount = otherSystems.reduce((sum, item) => sum + item.maintenance, 0);
      
      pieData = [
        ...topSystems,
        { system: "Others", maintenance: otherCount, fill: "" }
      ];
    }
    
    const config: ChartConfig = {
      maintenance: {
        label: "Maintenance",
      }
    };
    
    pieData = pieData.map((item, index) => {
      const key = item.system.toLowerCase().replace(/\s+/g, '-');
      config[key] = {
        label: item.system,
        color: chartColors[index % chartColors.length] || fallbackColors[index % fallbackColors.length],
      };
      
      return {
        ...item,
        fill: chartColors[index % chartColors.length] || fallbackColors[index % fallbackColors.length],
      };
    });
    
    const total = pieData.reduce((acc, curr) => acc + curr.maintenance, 0);
    
    return { 
      chartData: pieData, 
      chartConfig: config, 
      totalMaintenance: total 
    };
  }, [maintenanceData]);

  // Calculate trend percentage
  const trendPercentage = React.useMemo(() => {
    if (!maintenanceData || maintenanceData.length === 0) return 0;
    
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    
    const validData = maintenanceData.filter(item => 
      item && item.automation && item.automation.name && item.date
    );
    
    const currentMonthData = validData.filter(item => {
      const date = new Date(item.date);
      return date >= lastMonth && date <= today;
    });
    
    const previousMonthData = validData.filter(item => {
      const date = new Date(item.date);
      return date >= twoMonthsAgo && date < lastMonth;
    });
    
    if (previousMonthData.length === 0) return 0;
    
    const trend = ((currentMonthData.length - previousMonthData.length) / previousMonthData.length) * 100;
    return parseFloat(trend.toFixed(1));
  }, [maintenanceData]);

  // Get date range description
  const dateRangeDescription = React.useMemo(() => {
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 5);
    
    const startMonth = sixMonthsAgo.toLocaleString('default', { month: 'long' });
    const endMonth = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();
    
    return `${startMonth} - ${endMonth} ${year}`;
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Maintenance Distribution</CardTitle>
        <CardDescription>{dateRangeDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="maintenance"
              nameKey="system"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalMaintenance.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Events
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {trendPercentage > 0 ? (
            <>Trending up by {trendPercentage}% this month <TrendingUp className="h-4 w-4" /></>
          ) : trendPercentage < 0 ? (
            <>Trending down by {Math.abs(trendPercentage)}% this month <TrendingUp className="h-4 w-4 rotate-180" /></>
          ) : (
            <>No change from last month</>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Distribution of maintenance events by automation system
        </div>
      </CardFooter>
    </Card>
  )
}