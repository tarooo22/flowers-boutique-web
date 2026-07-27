import { createPortal } from "react-dom";
import { useState } from "react";
import { AlertCircle, MapPin, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface MapPinSelectorProps {
  initialLat?: number;
  initialLon?: number;
  initialAddress?: string;
  onConfirm: (lat: number, lon: number, address?: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

/** Dependency-free fallback while a licensed map provider is configured for the new store. */
export function MapPinSelector({ initialLat = 41.7151, initialLon = 44.8271, initialAddress = "", onConfirm, onCancel, isOpen }: MapPinSelectorProps) {
  const { language } = useLanguage();
  const [lat, setLat] = useState(initialLat);
  const [lon, setLon] = useState(initialLon);
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState<string | null>(null);
  if (!isOpen) return null;
  const locate = () => navigator.geolocation.getCurrentPosition(
    ({ coords }) => { setLat(coords.latitude); setLon(coords.longitude); setError(null); },
    () => setError(language === "ka" ? "მდებარეობის მიღება ვერ მოხერხდა." : "Location could not be retrieved.")
  );
  return createPortal(<div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"><section className="w-full max-w-lg bg-white p-6 shadow-2xl" role="dialog" aria-modal="true"><div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">{language === "ka" ? "მიწოდების ადგილი" : "Delivery location"}</h2><button onClick={onCancel} aria-label="Close"><X /></button></div><p className="mb-5 text-sm text-gray-600">{language === "ka" ? "შეიყვანეთ მისამართი ან გამოიყენეთ თქვენი მიმდინარე მდებარეობა. რუკის პროვაიდერი დაემატება კონფიგურაციის შემდეგ." : "Enter an address or use your current location. A map provider will be enabled after configuration."}</p><label className="mb-4 block text-sm">{language === "ka" ? "მისამართი" : "Address"}<Input value={address} onChange={e => setAddress(e.target.value)} className="mt-1" /></label><div className="grid grid-cols-2 gap-3"><label className="text-sm">Latitude<Input type="number" value={lat} onChange={e => setLat(Number(e.target.value))} className="mt-1" /></label><label className="text-sm">Longitude<Input type="number" value={lon} onChange={e => setLon(Number(e.target.value))} className="mt-1" /></label></div>{error && <p className="mt-3 flex gap-2 text-sm text-red-700"><AlertCircle size={16}/>{error}</p>}<Button variant="outline" onClick={locate} className="mt-5 w-full"><Navigation size={16} className="mr-2" />{language === "ka" ? "მიმდინარე მდებარეობის გამოყენება" : "Use current location"}</Button><div className="mt-5 flex gap-3"><Button variant="outline" onClick={onCancel} className="flex-1">{language === "ka" ? "გაუქმება" : "Cancel"}</Button><Button onClick={() => onConfirm(lat, lon, address)} className="flex-1"><MapPin size={16} className="mr-2" />{language === "ka" ? "დადასტურება" : "Confirm"}</Button></div></section></div>, document.body);
}

export default MapPinSelector;
