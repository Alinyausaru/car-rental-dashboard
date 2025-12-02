import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "bg-blue-500",
  },
  {
    title: "Active Users",
    value: "2,345",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "bg-green-500",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "-3.2%",
    trend: "down",
    icon: ShoppingCart,
    color: "bg-orange-500",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "+8.1%",
    trend: "up",
    icon: Activity,
    color: "bg-purple-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
