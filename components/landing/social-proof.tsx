import { CheckCircle2 } from "lucide-react";

interface SocialProofItem {
  readonly text: string;
  readonly icon?: string;
}

export function SocialProof({ items }: { items: readonly SocialProofItem[] }) {
  return (
    <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up animation-delay-400">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
