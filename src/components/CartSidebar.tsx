import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const tipOptions = [
  { label: "Kein", value: 0 },
  { label: "€1", value: 1 },
  { label: "€2", value: 2 },
  { label: "€3", value: 3 },
  { label: "€5", value: 5 },
];

export function CartSidebar({ isOpen, onClose, onCheckout }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const [selectedTip, setSelectedTip] = useState(0);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [isCO2Neutral, setIsCO2Neutral] = useState(false);

  const insuranceCost = 0.99;
  const co2Cost = 0.49;

  const extras = (hasInsurance ? insuranceCost : 0) + (isCO2Neutral ? co2Cost : 0) + selectedTip;
  const finalTotal = totalPrice + extras;

  const hasExtras = selectedTip > 0 || hasInsurance || isCO2Neutral;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-card z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-shopping-bag text-primary text-lg"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">Warenkorb</h2>
              <p className="text-sm text-muted-foreground">{totalItems} Artikel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <i className="fa-solid fa-xmark text-lg text-foreground"></i>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-basket-shopping text-3xl text-muted-foreground"></i>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Dein Warenkorb ist leer</h3>
              <p className="text-sm text-muted-foreground">Füge leckere Gerichte hinzu!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="p-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-secondary/50 rounded-xl p-3 animate-fade-in"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-card-foreground text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">€{item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <i className="fa-solid fa-minus text-xs"></i>
                          </button>
                          <span className="w-6 text-center font-semibold text-card-foreground text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Options Accordion */}
              <div className="px-4 pb-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="extras" className="border rounded-xl bg-secondary/30">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-sliders text-primary"></i>
                        <span className="font-medium text-card-foreground">Extras & Optionen</span>
                        {hasExtras && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            +€{extras.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 space-y-4">
                      {/* Tip Selection */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <i className="fa-solid fa-heart text-primary text-sm"></i>
                          <span className="text-sm font-medium text-card-foreground">Trinkgeld für den Fahrer</span>
                        </div>
                        <div className="flex gap-2">
                          {tipOptions.map((tip) => (
                            <button
                              key={tip.value}
                              onClick={() => setSelectedTip(tip.value)}
                              className={cn(
                                "flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all",
                                selectedTip === tip.value
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card border border-border text-card-foreground hover:bg-secondary"
                              )}
                            >
                              {tip.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Insurance */}
                      <label className="flex items-center gap-3 p-3 bg-card rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors border border-border">
                        <input
                          type="checkbox"
                          checked={hasInsurance}
                          onChange={(e) => setHasInsurance(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-shield-halved text-blue-500 text-sm"></i>
                            <span className="font-medium text-card-foreground text-sm">Lieferversicherung</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Schutz bei Problemen</p>
                        </div>
                        <span className="text-xs font-semibold text-card-foreground">+€{insuranceCost.toFixed(2)}</span>
                      </label>

                      {/* CO2 Neutral Delivery */}
                      <label className="flex items-center gap-3 p-3 bg-card rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors border border-border">
                        <input
                          type="checkbox"
                          checked={isCO2Neutral}
                          onChange={(e) => setIsCO2Neutral(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-leaf text-green-500 text-sm"></i>
                            <span className="font-medium text-card-foreground text-sm">CO2-neutral liefern</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Klimaschutz unterstützen</p>
                        </div>
                        <span className="text-xs font-semibold text-card-foreground">+€{co2Cost.toFixed(2)}</span>
                      </label>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-card">
            {/* Compact Price Summary */}
            <div className="space-y-1 mb-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Zwischensumme</span>
                <span className="text-card-foreground">€{totalPrice.toFixed(2)}</span>
              </div>
              {hasExtras && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Extras</span>
                  <span className="text-card-foreground">€{extras.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lieferung</span>
                <span className="text-green-500 font-medium">Kostenlos</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-3 border-t border-border mb-3">
              <span className="text-lg font-bold text-card-foreground">Gesamt</span>
              <span className="text-2xl font-bold text-primary">€{finalTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:bg-primary/90 transition-all shadow-glow hover:shadow-lg flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-bag-shopping"></i>
              Jetzt bestellen
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
