import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const amounts = [99, 299, 499, 999];

export const DonateSheet = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) => {
  const [selected, setSelected] = useState(299);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-0 max-w-md mx-auto p-6">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-bold">Поддержать автора</SheetTitle>
          <SheetDescription>
            Выберите сумму, чтобы открыть доступ к контенту
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3 py-6">
          {amounts.map((a) => (
            <button
              key={a}
              onClick={() => setSelected(a)}
              className={`py-4 rounded-2xl font-bold text-lg transition-all ${
                selected === a
                  ? "bg-primary text-primary-foreground shadow-button"
                  : "bg-secondary text-foreground hover:bg-primary-soft"
              }`}
            >
              {a} ₽
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              toast.success(`Спасибо за донат ${selected} ₽!`);
              setIsLoading(false);
              onOpenChange(false);
            }, 1500);
          }}
          disabled={isLoading}
          style={{
            width: '100%',
            height: '42px',
            borderRadius: '14px',
            padding: '16px 32px',
            background: 'rgba(78, 17, 164, 1)',
            color: 'white',
            border: 'none',
            fontSize: '15px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 200ms',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: isLoading ? 0.8 : 1,
            boxSizing: 'border-box',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Отправить {selected} ₽</span>
            </>
          ) : (
            <span>Отправить {selected} ₽</span>
          )}
        </button>
      </SheetContent>
    </Sheet>
  );
};
