import { Instagram, Phone, MapPin, Briefcase, MessageCircle, Truck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-8">
      {/* Main Grid */}
      <div className="container mx-auto px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-slate-800">Taste of Madurai</h4>
          <p className="text-sm text-slate-600 mb-2">Sat–Sun: 10:00–19:00</p>
          <a
            className="text-sm flex items-center gap-2 text-slate-700 hover:text-[#7A1F1F] transition-colors"
            href="https://maps.app.goo.gl/by2HLDymUM9L14kR6"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin className="h-4 w-4" /> Find us on Maps
          </a>
        </div>

        {/* Order Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-slate-800">Order</h4>
          <a className="text-sm flex items-center gap-2 mb-2 text-slate-700 hover:text-[#7A1F1F]" href="tel:+46734991206">
            <Phone className="h-4 w-4" /> Self pick-up: +46-734991206
          </a>
          <a
            className="text-sm flex items-center gap-2 text-slate-700 hover:text-[#7A1F1F]"
            href="http://foodora.se/restaurant/vbdi/taste-of-madurai"
            target="_blank"
            rel="noreferrer"
          >
            <Truck className="h-4 w-4" /> Delivery via Foodora
          </a>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-slate-800">Social</h4>
          <a
            className="text-sm flex items-center gap-2 mb-2 text-slate-700 hover:text-[#7A1F1F]"
            href="https://www.instagram.com/taste_ofmadurai"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
          <a
            className="text-sm flex items-center gap-2 text-slate-700 hover:text-[#7A1F1F]"
            href="http://tiktok.com/@tasteofmadurai"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-4 w-4" /> TikTok
          </a>
        </div>

        {/* Careers / Feedback */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-slate-800">Feedback & Careers</h4>
          <a className="text-sm flex items-center gap-2 mb-2 text-slate-700 hover:text-[#7A1F1F]" href="/contact">
            <MessageCircle className="h-4 w-4" /> Leave feedback
          </a>
          <a className="text-sm flex items-center gap-2 text-slate-700 hover:text-[#7A1F1F]" href="/careers">
            <Briefcase className="h-4 w-4" /> Careers
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-slate-500 py-4 border-t bg-slate-100">
        &copy; {new Date().getFullYear()} Taste of Madurai. All rights reserved.
      </div>
    </footer>
  );
}
