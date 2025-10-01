"use client"

import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";

import {
    ChartConfig,
    ChartContainer, ChartLegend, ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";
import {formatCurrency} from "@/lib/utils";

export const IncomeChart = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.orders.getForReferral.queryOptions())

    const chartConfig = {
        potential: {
            label: "Потенциальный доход",
            color: "#f25647",
        },
        real: {
            label: "Полученный доход",
            color: "#0084cf",
        },
    } satisfies ChartConfig

    return (
        <div className="flex flex-col gap-y-2">
            <h5>Потенциальный доход: {formatCurrency(data?.totalPotentialIncome || 0)}</h5>
            <h5>Полученный доход: {formatCurrency(data?.totalRealIncome || 0)}</h5>
            {
                data &&
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={data.incomeList}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="potential"
                            type="natural"
                            fill="#f25647"
                            fillOpacity={0.4}
                            stroke="#f25647"
                            stackId="a"
                        />
                        <Area
                            dataKey="real"
                            type="natural"
                            fill="#0084cf"
                            fillOpacity={0.4}
                            stroke="#0084cf"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            }
        </div>
    )

}