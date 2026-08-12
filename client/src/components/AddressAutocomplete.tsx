import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export interface AddressOption {
  formatted: string;
  lat: number;
  lon: number;
  placeId?: string;
  address_line1?: string;
  address_line2?: string;
  result_type?: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (option: AddressOption) => void;
  placeholder?: string;
}

const translations = {
  en: {
    searchPlaceholder: "Search for address or street...",
    noResults: "No addresses found",
    networkError: "Network error, try again",
  },
  ka: {
    searchPlaceholder: "ძებნეთ მისამართი ან ქუჩა...",
    noResults: "მისამართი ვერ მოიძებნა",
    networkError: "ქსელის შეცდომა, სცადეთ ხელახლა",
  },
};

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
}: AddressAutocompleteProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();

  // Search addresses with debounce
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await utils.geoapify.searchAddresses.fetch({
          query: value,
          language: language === "ka" ? "ka" : "en",
        });

        if (results && results.length > 0) {
          setSuggestions(results);
          setIsOpen(true);
        } else {
          setSuggestions([]);
          setSearchError(t.noResults);
        }
      } catch (error: any) {
        console.error("[AddressAutocomplete] Search error:", error);
        setSearchError(t.networkError);
        setSuggestions([]);
      }
      setIsSearching(false);
    }, 400);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [value, language, utils]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSelectSuggestion = (suggestion: AddressOption) => {
    onChange(suggestion.formatted);
    onSelect(suggestion);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const container = document.querySelector('[data-address-autocomplete]');
    if (container && !container.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" data-address-autocomplete>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder || t.searchPlaceholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.trim().length > 0 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          className="pl-10 border-[#E8DCC8] rounded-lg"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-3 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E8DCC8] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.length > 0 ? (
            <ul className="divide-y divide-[#E8DCC8]">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-[#FFF8F5] transition-colors flex items-start gap-3"
                  >
                    <MapPin className="w-4 h-4 text-[#C4603A] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-[#1C1C1C] truncate">
                        {suggestion.formatted}
                      </div>
                      {suggestion.address_line2 && (
                        <div className="text-xs text-gray-500 truncate">
                          {suggestion.address_line2}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : searchError ? (
            <div className="px-4 py-3 text-sm text-gray-600">
              {searchError}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
