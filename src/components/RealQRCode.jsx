import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, QrCode as QrIcon, Sparkles } from 'lucide-react';

export default function RealQRCode({
  booking,
  value,
  size = 220,
  showActions = true,
  className = ''
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Formulate structured QR payload
  const qrPayload = React.useMemo(() => {
    if (value) return typeof value === 'string' ? value : JSON.stringify(value);
    if (!booking) return 'FOODIE-RESCUE-VALID';

    // Structured JSON payload that our in-app scanner and any camera can decode
    return JSON.stringify({
      app: 'FOODIE-RESCUE',
      token: booking.tokenCode || booking.id,
      otp: booking.otp || '101-202',
      bookingId: booking.id,
      mealTitle: booking.mealTitle || 'Surplus Meal',
      restaurant: booking.restaurantName || booking.restaurant || 'Commercial Partner',
      portions: booking.portions || 1,
      totalPaid: booking.totalPaid || booking.originalAmount || 0,
      pickupWindow: booking.pickupWindow || 'Tonight',
      issuedAt: booking.bookingDate || new Date().toISOString()
    });
  }, [value, booking]);

  useEffect(() => {
    let isMounted = true;

    QRCode.toDataURL(qrPayload, {
      width: size * 2, // high DPI
      margin: 2,
      color: {
        dark: '#064e3b', // Deep emerald dark modules
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H' // High error correction
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate real QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [qrPayload, size]);

  const handleCopyToken = () => {
    const token = booking?.tokenCode || booking?.id || qrPayload;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Foodie-Pickup-Pass-${booking?.tokenCode || 'Voucher'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Real QR Display Box */}
      <div className="relative p-3.5 bg-white rounded-3xl border-2 border-emerald-400 shadow-md inline-block">
        {qrDataUrl ? (
          <div className="relative flex items-center justify-center">
            <img
              src={qrDataUrl}
              alt={`QR Code for Token ${booking?.tokenCode || 'Voucher'}`}
              style={{ width: `${size}px`, height: `${size}px` }}
              className="rounded-xl object-contain block"
            />
            {/* Center Foodie Badge overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-extrabold text-[10px] flex flex-col items-center justify-center shadow-lg border-2 border-white">
                <span className="leading-none">FD</span>
                <span className="text-[7px] font-mono leading-none mt-0.5">PASS</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="flex flex-col items-center justify-center bg-slate-50 rounded-xl text-slate-400 gap-2 animate-pulse"
          >
            <QrIcon className="w-8 h-8 animate-spin" />
            <span className="text-[11px] font-bold">Generating Real QR...</span>
          </div>
        )}

        {/* Security watermark */}
        <div className="mt-2 text-center">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>100% Real Scannable QR Voucher</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleCopyToken}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            title="Copy pickup token code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition cursor-pointer"
            title="Download QR code image for offline pickup"
          >
            {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-emerald-700" />}
            <span>{downloaded ? 'Saved!' : 'Save QR'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
