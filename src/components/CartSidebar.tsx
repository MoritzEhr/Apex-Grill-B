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
  { label: "None", value: 0 },
  { label: "5%", value: 0.05 },
  { label: "10%", value: 0.10 },
  { label: "15%", value: 0.15 },
  { label: "20%", value: 0.20 },
];

const MINIMUM_ORDER_VALUE = 25; // Minimum order value in euros

export function CartSidebar({ isOpen, onClose, onCheckout }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const [selectedTipPercent, setSelectedTipPercent] = useState(0);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [isCO2Neutral, setIsCO2Neutral] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

  const insuranceCost = 0.99;
  const co2Cost = 0.49;
  const deliveryFee = 2.99;

  const tipAmount = totalPrice * selectedTipPercent;
  const extras = (hasInsurance ? insuranceCost : 0) + (isCO2Neutral ? co2Cost : 0) + tipAmount;
  const finalTotal = totalPrice + extras + deliveryFee;

  const hasExtras = selectedTipPercent > 0 || hasInsurance || isCO2Neutral;
  const meetsMinimumOrder = totalPrice >= MINIMUM_ORDER_VALUE;
  const remainingAmount = Math.max(0, MINIMUM_ORDER_VALUE - totalPrice);

  const handleProceedToCheckout = () => {
    if (!meetsMinimumOrder) {
      return;
    }
    setShowOrderSummary(true);
  };

  const handleConfirmOrder = () => {
    if (!meetsMinimumOrder) {
      return;
    }
    setShowOrderSummary(false);
    onCheckout();
  };

  const handleBackToCart = () => {
    setShowOrderSummary(false);
  };

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
        {/* Order Summary View */}
        {showOrderSummary ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToCart}
                  className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                >
                  <i className="fa-solid fa-arrow-left text-foreground"></i>
                </button>
                <h2 className="text-xl font-bold text-card-foreground">Order Summary</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark text-lg text-foreground"></i>
              </button>
            </div>

            {/* Summary Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Order Items Summary */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-receipt text-primary"></i>
                  Your Order ({totalItems} items)
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                      <span className="text-card-foreground font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-card-foreground">{totalPrice.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="text-card-foreground">{deliveryFee.toFixed(2)}€</span>
                </div>
                {extras > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Extras</span>
                    <span className="text-card-foreground">{extras.toFixed(2)}€</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-card-foreground">Total</span>
                  <span className="font-bold text-primary text-lg">{finalTotal.toFixed(2)}€</span>
                </div>
              </div>

              {/* Subscription Option */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={hasSubscription}
                      onChange={(e) => setHasSubscription(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fa-solid fa-crown text-warning"></i>
                      <span className="font-bold text-card-foreground">Free Subscription</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                    First week <span className="font-semibold text-success">0.00€</span>, then 4.99€/month. 
                      Cancel anytime. Get free delivery and exclusive deals!
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="p-4 border-t border-border bg-card">
              {!meetsMinimumOrder && (
                <div className="mb-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center gap-2 text-warning">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    <span className="text-sm font-medium">
                      Mindestbestellwert: {MINIMUM_ORDER_VALUE}€
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Noch {remainingAmount.toFixed(2)}€ bis zum Mindestbestellwert
                  </p>
                </div>
              )}
              <button
                onClick={handleConfirmOrder}
                disabled={!meetsMinimumOrder}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-base transition-all shadow-glow flex items-center justify-center gap-2",
                  meetsMinimumOrder
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                )}
              >
                <i className="fa-solid fa-check"></i>
                Confirm Order - {finalTotal.toFixed(2)}€
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-shopping-bag text-primary text-lg"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">Cart</h2>
                  <p className="text-sm text-muted-foreground">{totalItems} items</p>
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
            <div className="flex-1 overflow-y-auto min-h-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <i className="fa-solid fa-basket-shopping text-3xl text-muted-foreground"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground">Add some delicious dishes!</p>
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
                          <p className="text-sm text-muted-foreground mb-2">{item.price.toFixed(2)}€</p>
                          
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
                            <span className="font-medium text-card-foreground">Extras & Options</span>
                            {hasExtras && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                +{extras.toFixed(2)}€
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 space-y-4">
                          {/* Tip Selection */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <i className="fa-solid fa-heart text-primary text-sm"></i>
                              <span className="text-sm font-medium text-card-foreground">Tip for the driver</span>
                            </div>
                            <div className="flex gap-2">
                              {tipOptions.map((tip) => (
                                <button
                                  key={tip.value}
                                  onClick={() => setSelectedTipPercent(tip.value)}
                                  className={cn(
                                    "flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all",
                                    selectedTipPercent === tip.value
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-card border border-border text-card-foreground hover:bg-secondary"
                                  )}
                                >
                                  {tip.label}
                                </button>
                              ))}
                            </div>
                            {selectedTipPercent > 0 && (
                              <p className="text-xs text-muted-foreground mt-1 text-center">
                                Tip: {tipAmount.toFixed(2)}€
                              </p>
                            )}
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
                                <span className="font-medium text-card-foreground text-sm">Delivery Insurance</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Protection for issues</p>
                            </div>
                            <span className="text-xs font-semibold text-card-foreground">+{insuranceCost.toFixed(2)}€</span>
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
                                <span className="font-medium text-card-foreground text-sm">CO2-Neutral Delivery</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Support climate protection</p>
                            </div>
                            <span className="text-xs font-semibold text-card-foreground">+{co2Cost.toFixed(2)}€</span>
                          </label>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </>
              )}
            </div>

            {/* Fixed Footer - Always at bottom */}
            {items.length > 0 && (
              <div className="cart-footer p-4 border-t border-border bg-card flex-shrink-0">
                {/* Compact Price Summary */}
                <div className="space-y-1 mb-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-card-foreground">{totalPrice.toFixed(2)}€</span>
                  </div>
                  {hasExtras && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Extras</span>
                      <span className="text-card-foreground">{extras.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-card-foreground">{deliveryFee.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-3 border-t border-border mb-3">
                  <span className="text-lg font-bold text-card-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">{finalTotal.toFixed(2)}€</span>
                </div>

                {/* Minimum Order Value Warning */}
                {!meetsMinimumOrder && (
                  <div className="mb-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2 text-warning">
                      <i className="fa-solid fa-exclamation-triangle"></i>
                      <span className="text-sm font-medium">
                        Mindestbestellwert: {MINIMUM_ORDER_VALUE}€
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Noch {remainingAmount.toFixed(2)}€ bis zum Mindestbestellwert
                    </p>
                  </div>
                )}

                <button
                  onClick={handleProceedToCheckout}
                  disabled={!meetsMinimumOrder}
                  className={cn(
                    "w-full py-3 rounded-xl font-bold text-base transition-all shadow-glow flex items-center justify-center gap-2",
                    meetsMinimumOrder
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  )}
                >
                  <i className="fa-solid fa-bag-shopping"></i>
                  Order Now
                </button>
              </div>
            )}
          </>
        )}
      </aside>
    </>
  );
}
