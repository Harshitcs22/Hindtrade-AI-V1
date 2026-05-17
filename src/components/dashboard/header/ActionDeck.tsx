"use client";

interface ActionDeckProps {
  onChatOpen?: () => void;
  isPending: boolean;
  slug?: string;
}

export function ActionDeck({ onChatOpen, isPending, slug }: ActionDeckProps) {
  const handleActionClick = async (actionName: string, actionFn?: () => void | Promise<void>) => {
    if (!slug) {
      console.error(`Action aborted: Target identifier slug is missing for ${actionName}.`);
      return;
    }
    try {
      if (actionFn) {
        await actionFn();
      }
    } catch (err) {
      console.error("Network interface connection failure:", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-6">

      <button
        onClick={() => handleActionClick("AI Sales Agent", onChatOpen)}
        disabled={isPending}
        className="font-sans text-[11px] tracking-[0.15em] uppercase font-medium text-[#22D3EE] px-5 py-2.5 border border-[#22D3EE] bg-transparent hover:bg-white/[0.03] shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all animate-[pulse_2.8s_ease-in-out_infinite] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        TALK TO SALES HEAD (AI)
      </button>
    </div>
  );
}
