import React from 'react';

export default function StatCard({ title, value, icon: Icon, color, trend }) {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`rounded-lg p-3 ${color}`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="truncate text-sm font-medium text-gray-500">
                                {title}
                            </dt>
                            <dd className="text-2xl font-semibold text-gray-900">
                                {value}
                            </dd>
                            {trend && (
                                <dd className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.percentage)}% from last month
                                </dd>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}