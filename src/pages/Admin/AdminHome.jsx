import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  DollarSign,
  UtensilsCrossed,
  Star as StarIcon,
  ImageIcon,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "../../api/dashboardApi";
import { toast } from "sonner";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalActiveItems: 0,
    activeOffers: 0,
    totalReviews: 0,
    totalMoments: 0,
    totalVisits: 0,
    visitorTrend: [],
    recentReviews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen pb-10 space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-brand-dark uppercase tracking-wide">
            Dashboard
          </h1>
          <p className="text-brand-dark/60 font-medium">
            Visitor insights & Content overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-full bg-brand-primary text-white hover:bg-brand-dark transition-colors">
            Live View{" "}
            <span className="ml-2 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </Button>
        </div>
      </div>

      {/* KPI Cards (Reduced) */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Visits"
          value={stats.totalVisits}
          trend="Unique sessions detected"
          icon={Users}
          trendUp={true}
          loading={loading}
        />
        <StatsCard
          title="Active Offers"
          value={stats.activeOffers}
          trend="Current specials"
          icon={DollarSign}
          trendUp={true}
          loading={loading}
          trendColor="text-green-600"
        />
        <StatsCard
          title="Menu Items"
          value={`${stats.totalActiveItems} / ${stats.totalItems}`}
          trend="Available / Total"
          icon={UtensilsCrossed}
          trendUp={true}
          loading={loading}
          trendColor="text-brand-primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Visitor Trend Chart */}
        <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 shadow-xl border border-brand-dark/5">
          <div className="mb-6">
            <h3 className="text-xl font-display font-bold text-brand-dark uppercase tracking-wide">
              Visitor Trend
            </h3>
            <p className="text-sm text-brand-dark/40 font-bold uppercase tracking-widest">
              Last 7 Days
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.visitorTrend}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#AD343E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#AD343E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) =>
                    new Date(val).toLocaleDateString(undefined, {
                      weekday: "short",
                    })
                  }
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  labelFormatter={(val) => new Date(val).toLocaleDateString()}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#AD343E"
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Reviews (Replaces Activity) */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 shadow-xl border border-brand-dark/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold text-brand-dark uppercase tracking-wide">
              Recent Reviews
            </h3>
            <Link
              to="/admin/reviews"
              className="text-xs font-bold text-brand-primary uppercase tracking-widest hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] custom-scrollbar">
            {stats.recentReviews.length === 0 ? (
              <p className="text-sm text-brand-dark/40 text-center py-10">
                No reviews yet.
              </p>
            ) : (
              stats.recentReviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 rounded-xl bg-brand-cream/30 border border-brand-dark/5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <StarIcon key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs text-brand-dark/40 font-bold">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-brand-dark line-clamp-2 italic">
                    "{review.comment}"
                  </p>
                  <p className="text-xs text-brand-dark/60 font-bold mt-2">
                    - {review.name}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Content Stats & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Real Content Stats */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-brand-dark/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold text-brand-dark uppercase tracking-wide">
              Content Stats
            </h3>
            <Link
              to="/admin/items"
              className="text-xs font-bold text-brand-primary uppercase tracking-widest hover:underline"
            >
              Manage Content
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ContentStatCard
              label="Total Reviews"
              value={stats.totalReviews}
              icon={StarIcon}
              color="text-yellow-500"
              bg="bg-yellow-100"
              loading={loading}
            />
            <ContentStatCard
              label="Gallery Photos"
              value={stats.totalMoments}
              icon={ImageIcon}
              color="text-purple-500"
              bg="bg-purple-100"
              loading={loading}
            />
            <ContentStatCard
              label="Active Offers"
              value={stats.activeOffers}
              icon={DollarSign}
              color="text-green-500"
              bg="bg-green-100"
              loading={loading}
            />
            <ContentStatCard
              label="Menu Items"
              value={stats.totalItems}
              icon={UtensilsCrossed}
              color="text-brand-primary"
              bg="bg-brand-primary/10"
              loading={loading}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-brand-dark/5">
          <div className="mb-6">
            <h3 className="text-xl font-display font-bold text-brand-dark uppercase tracking-wide">
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <QuickAction
              to="/admin/items/new"
              label="Add Dish"
              icon={UtensilsCrossed}
            />
            <QuickAction
              to="/admin/offers"
              label="Create Offer"
              icon={DollarSign}
            />
            <QuickAction
              to="/admin/moments"
              label="Upload Photo"
              icon={TrendingUp}
            />
            <QuickAction to="/admin/reviews" label="Reviews" icon={StarIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  trend,
  icon: Icon,
  trendUp,
  trendColor,
  loading,
}) {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-brand-dark/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-bold text-brand-dark/40 uppercase tracking-widest">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-24 bg-brand-dark/10 animate-pulse rounded mt-2" />
          ) : (
            <h3 className="text-3xl font-display font-bold text-brand-dark mt-1">
              {value}
            </h3>
          )}
        </div>
        <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs font-bold">
        <span
          className={
            trendColor || (trendUp ? "text-green-500" : "text-red-500")
          }
        >
          {trend}
        </span>
      </div>
    </div>
  );
}

function ContentStatCard({ label, value, icon: Icon, color, bg, loading }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-brand-dark/5 bg-brand-cream/30">
      <div
        className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-wide">
          {label}
        </p>
        {loading ? (
          <div className="h-6 w-12 bg-brand-dark/10 animate-pulse rounded mt-1" />
        ) : (
          <p className="text-2xl font-display font-bold text-brand-dark">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function QuickAction({ to, label, icon: Icon }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-brand-cream/50 border border-brand-dark/5 hover:bg-brand-primary hover:text-white transition-all duration-300 group"
    >
      <Icon className="w-6 h-6 text-brand-dark/60 group-hover:text-white transition-colors" />
      <span className="text-sm font-bold uppercase tracking-wide">{label}</span>
    </Link>
  );
}
