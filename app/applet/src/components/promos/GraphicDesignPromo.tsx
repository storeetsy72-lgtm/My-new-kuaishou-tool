import { useEffect, useState } from "react";
import { X, Palette, CheckCircle2, MessageCircle, Zap, ShieldCheck, Infinity, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GraphicDesignPromo({
  onClose,
}: {
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("03437893678");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] w-[calc(100%-2rem)] max-w-[340px] animate-in slide-in-from-bottom-5 fade-in duration-300 mx-auto left-4 right-4 sm:left-auto"
      role="dialog"
      aria-label="Graphic Design Services"
    >
      <div className="glass-card overflow-hidden rounded-2xl bg-card shadow-2xl border border-border">
        {/* Header Section */}
        <div className="bg-orange-50/50 dark:bg-orange-950/20 p-4 pb-3 relative border-b border-orange-100/50 dark:border-orange-900/20">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="tap absolute right-2 top-2 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="size-4" />
          </button>
          
          <div className="flex flex-col items-center text-center mt-1">
            <h2 className="text-base font-extrabold text-foreground tracking-tight leading-tight">
              Need Professional <br/> <span className="text-orange-500">Design Work?</span>
            </h2>
            <p className="text-[11px] text-muted-foreground mt-1.5 px-2">
              We provide any type of graphic design for your business, brand or content.
            </p>
          </div>
        </div>
        
        {/* Body Section */}
        <div className="p-4 space-y-4">
          <ul className="grid grid-cols-2 gap-x-2 gap-y-2.5 text-[11px] font-semibold text-foreground/80">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-green-500" /> Thumbnails</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-green-500" /> Banners</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-green-500" /> Social Posts</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-green-500" /> Logos & More</li>
          </ul>

          <div className="rounded-xl bg-gradient-to-b from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/10 p-3 text-center border border-green-200/50 dark:border-green-800/30">
             <p className="text-[13px] font-bold mb-2 text-foreground">Have a Custom Design in Mind?</p>
             <Button 
               className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex gap-2 rounded-xl h-10 font-bold shadow-sm"
               onClick={() => window.open("https://wa.me/03437893678", "_blank", "noopener,noreferrer")}
             >
               <MessageCircle className="size-4" />
               Chat on WhatsApp
             </Button>
             
             {/* Copyable Phone Number */}
             <div className="mt-2 flex items-center justify-center gap-1.5">
               <p className="text-[13px] font-black tracking-wide text-foreground/90">
                  0343 789 3678
               </p>
               <button
                 type="button"
                 onClick={handleCopy}
                 className="tap flex items-center justify-center rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                 aria-label="Copy phone number"
               >
                 {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
               </button>
             </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex justify-center gap-3 text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
             <div className="flex items-center gap-1"><Zap className="size-3 text-orange-400"/> Fast</div>
             <div className="flex items-center gap-1"><ShieldCheck className="size-3 text-green-500"/> Quality</div>
             <div className="flex items-center gap-1"><Infinity className="size-3 text-blue-400"/> Revisions</div>
          </div>

          <Button variant="outline" className="w-full text-xs h-9 rounded-xl font-semibold text-muted-foreground" onClick={onClose}>
            Not interested, skip
          </Button>
        </div>
      </div>
    </div>
  );
}
