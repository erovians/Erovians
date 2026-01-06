import { useState } from "react";
import { X, Check, Globe, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
];

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
];

export default function LanguageCurrencyModal({ isOpen, onClose }) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const handleSave = () => {
    localStorage.setItem("language", selectedLanguage);
    localStorage.setItem("currency", selectedCurrency);
    console.log("Saved:", { selectedLanguage, selectedCurrency });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-navyblue flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Currency Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Select Language
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 transition-all min-h-15 ${
                    selectedLanguage === lang.code
                      ? "border-navyblue bg-lightblue"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium text-xs truncate flex-1 text-left">
                    {lang.name}
                  </span>
                  {selectedLanguage === lang.code && (
                    <Check className="h-3.5 w-3.5 text-navyblue shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Select Currency
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setSelectedCurrency(curr.code)}
                  className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border-2 transition-all min-17.5 relative ${
                    selectedCurrency === curr.code
                      ? "border-navyblue bg-lightblue"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {selectedCurrency === curr.code && (
                    <Check className="h-3.5 w-3.5 text-navyblue absolute top-1.5 right-1.5" />
                  )}
                  <span className="text-lg font-bold text-navyblue">
                    {curr.symbol}
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-xs">{curr.code}</span>
                    <span className="text-[10px] text-gray-600 text-center leading-tight">
                      {curr.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 rounded-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-navyblue hover:bg-blue text-white px-6 rounded-sm"
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
