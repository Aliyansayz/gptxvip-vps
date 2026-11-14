import {
  AlertTriangle,
  TrendingUp,
  ThermometerSnowflake,
} from "lucide-react";

export const widgets = {
  stats: {
    totalRides: {
      id: "stat-total-rides",
      topBarColor: "bg-cyan-400",
      badgeType: "positive" as const,
    },
    avgFare: {
      id: "stat-avg-fare",
      topBarColor: "bg-indigo-500",
      badgeType: "positive" as const,
    },
    avgDuration: {
      id: "stat-avg-duration",
      topBarColor: "bg-sky-400",
      badgeType: "neutral" as const,
    },
    holidayPremium: {
      id: "stat-holiday-premium",
      topBarColor: "bg-rose-500",
      badgeTypeAlert: "alert" as const,
      badgeTypeNeutral: "neutral" as const,
    },
  },
  copilotTemplates: [
    {
      id: "template-bottlenecks",
      title: "Bottleneck Scanner",
      desc: "Detect hours with low speeds and high premiums",
      icon: AlertTriangle,
      prompt:
        "Identify the top operational bottlenecks in this dataset. Which slots experience high delays (long trip durations), high traffic, but low ride fulfillment? Propose a congestion pricing adjustment.",
      colorKey: "bottleneck" as const,
    },
    {
      id: "template-shifts",
      title: "Shift Rostering Target",
      desc: "Propose driver fleet distribution targets",
      icon: TrendingUp,
      prompt:
        "Based on seasonal averages and holiday factors, compile a strategic shift-scheduling recommendations list for taxi fleet operators. Where should we concentrate driver rosters in Spring vs Summer?",
      colorKey: "shifts" as const,
    },
    {
      id: "template-weather",
      title: "Climate Friction Analysis",
      desc: "Assess surges on snowy and rainy weeks",
      icon: ThermometerSnowflake,
      prompt:
        "Detail the climate friction coefficient of this data. How do rainfall and snow storms affect ride demand and fare multiplier surges? State specific metrics in your calculations.",
      colorKey: "weather" as const,
    },
  ],
};
