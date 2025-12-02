"use client";

import { Card, CardContent } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: string;
  gradient: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, gradient, title, description }: FeatureCardProps) {
  // Dynamically get icon component
  const IconComponent = (LucideIcons[icon as keyof typeof LucideIcons] as LucideIcon) || LucideIcons.Star;

  return (
    <Card className="border-2 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl group">
      <CardContent className="pt-6">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
}
