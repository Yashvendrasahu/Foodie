import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import confetti from 'canvas-confetti';
import {
  Camera, X, FlipHorizontal, Flashlight, Upload, CheckCircle2,
  AlertTriangle, ShieldCheck, User, Phone, Utensils, RefreshCw,
  QrCode, Sparkles, ExternalLink, ArrowRight, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function RealQRScannerModal({
  isOpen,
  onClose,
  targetBookingId = null,
  onSuccessHandover = null
}) {
  const { bookings, markBookingHandedOver, showToast } = useApp();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameId = useRef(null);
  const fileInputRef = useRef(null);

  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [torchOn, setTorchOn] = useState(false);
  const [cameraState, setCameraState] = useState('idle'); // 'idle' | 'starting' | 'active' | 'error'
  const [cameraError, setCameraError] = useState('');
  const [scannedResult, setScannedResult] = useState(null); // decoded data
  const [matchedBooking, setMatchedBooking] = useState(null);
  const [handoverSuccess, setHandoverSuccess] = useState(false);
  const [manualTokenInput, setManualTokenInput] = useState('');

  // Audio confirmation chime
  const playBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }, []);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchOn(false);
  }, []);

  // Process decoded QR text into token
  const processDecodedString = useCallback((rawText) => {
    if (!rawText) return;
    playBeep();

    let extractedToken = rawText.trim();
    let parsedOtp = null;

    // Check if JSON
    try {
      if (rawText.startsWith('{') && rawText.endsWith('}')) {
        const json = JSON.parse(rawText);
        extractedToken = json.token || json.bookingId || json.id || extractedToken;
        parsedOtp = json.otp || null;
      }
    } catch (e) {
      // Not JSON, continue with string pattern
    }

    // Check if format like FOODIE-RESCUE-FD4827-...
    if (extractedToken.includes('FOODIE-RESCUE-')) {
      const match = extractedToken.match(/FD-\d+/i);
      if (match) extractedToken = match[0];
    }

    // Try finding matching booking in AppContext
    const cleanSearch = extractedToken.toLowerCase().replace('#', '').trim();
    const found = bookings.find((b) => {
      const bToken = (b.tokenCode || '').toLowerCase();
      const bId = (b.id || '').toLowerCase();
      return bToken === cleanSearch || bId === cleanSearch || bToken.includes(cleanSearch);
    });

    setScannedResult({
      raw: rawText,
      token: extractedToken,
      otp: parsedOtp || found?.otp || 'Verified'
    });

    if (found) {
      setMatchedBooking(found);
      showToast(`🎯 QR code verified for Token #${found.tokenCode || found.id}!`, 'success');
    } else {
      setMatchedBooking(null);
      showToast(`Scanned code: ${extractedToken} (Not found in active bookings ledger)`, 'warning');
    }
  }, [bookings, playBeep, showToast]);

  // QR scan loop using requestAnimationFrame + jsQR
  const scanLoop = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        processDecodedString(code.data);
        return; // stop scanning while showing result
      }
    }

    animationFrameId.current = requestAnimationFrame(scanLoop);
  }, [processDecodedString]);

  // Start real camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraState('starting');
    setCameraError('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API (getUserMedia) is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraState('active');
        animationFrameId.current = requestAnimationFrame(scanLoop);
      }
    } catch (err) {
      console.warn('Real camera error:', err);
      setCameraState('error');
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings, or upload a QR image below.'
          : err.message || 'Unable to access camera.'
      );
    }
  }, [facingMode, stopCamera, scanLoop]);

  // Toggle Torch if track supports it
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    const capabilities = track.getCapabilities ? track.getCapabilities() : {};
    if (!capabilities.torch) {
      showToast('Flashlight torch is not supported on this camera/device.', 'info');
      return;
    }
    try {
      const nextTorch = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setTorchOn(nextTorch);
    } catch (e) {
      showToast('Could not toggle torch.', 'info');
    }
  };

  // Flip between environment (rear) and user (selfie) camera
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Handle uploaded QR image file
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          processDecodedString(code.data);
        } else {
          showToast('Could not find a valid QR code in the uploaded image.', 'error');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Confirm handover
  const handleConfirmHandover = () => {
    if (!matchedBooking) return;
    markBookingHandedOver(matchedBooking.id);
    setHandoverSuccess(true);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (onSuccessHandover) {
      onSuccessHandover(matchedBooking);
    }
  };

  // Reset and scan next
  const handleScanNext = () => {
    setScannedResult(null);
    setMatchedBooking(null);
    setHandoverSuccess(false);
    setManualTokenInput('');
    if (cameraState === 'active') {
      animationFrameId.current = requestAnimationFrame(scanLoop);
    } else {
      startCamera();
    }
  };

  // Manual token lookup fallback
  const handleManualSearch = (e) => {
    e?.preventDefault();
    if (!manualTokenInput.trim()) return;
    processDecodedString(manualTokenInput.trim());
  };

  // Lifecycle: open/close camera
  useEffect(() => {
    if (isOpen) {
      setScannedResult(null);
      setMatchedBooking(null);
      setHandoverSuccess(false);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Hidden Canvas for QR video frame decoding */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Live Counter QR Scanner</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  REAL WEBCAM
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Scan customer's Foodie digital pickup voucher pass
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Camera Viewfinder OR Result Card */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {!scannedResult ? (
            /* ========================================================= */
            /* REAL CAMERA VIEWFINDER VIEW                               */
            /* ========================================================= */
            <div className="space-y-4">
              <div className="relative w-full aspect-4/3 sm:aspect-16/10 bg-black rounded-3xl overflow-hidden border border-slate-700 flex items-center justify-center shadow-inner group">
                
                {/* Live Video Element */}
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    cameraState === 'active' ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Loading / Error States Overlay */}
                {cameraState === 'starting' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/80 text-slate-300">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                    <span className="text-xs font-bold">Initializing real camera sensor...</span>
                  </div>
                )}

                {cameraState === 'error' && (
                  <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center gap-3 bg-slate-950/90 text-slate-200">
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Camera Access Notice</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                        {cameraError}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={startCamera}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload QR Image
                      </button>
                    </div>
                  </div>
                )}

                {/* Laser Target Box when camera is active */}
                {cameraState === 'active' && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-emerald-400 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] flex items-center justify-center">
                      
                      {/* Corner Target Markers */}
                      <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                      <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                      <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

                      {/* Animated Laser Scanning Line */}
                      <div className="absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce" />

                      <p className="absolute -bottom-8 text-[11px] font-semibold text-emerald-300 bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-xs">
                        Align Diner QR within frame
                      </p>
                    </div>
                  </div>
                )}

                {/* Camera Control Badges Top/Bottom */}
                <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>{cameraState === 'active' ? 'LIVE SCANNER' : 'STANDBY'}</span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={handleFlipCamera}
                    className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-xs transition cursor-pointer"
                    title="Flip camera lens"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToggleTorch}
                    className={`p-2 rounded-full backdrop-blur-xs transition cursor-pointer ${
                      torchOn ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900/80 hover:bg-slate-800 text-white'
                    }`}
                    title="Toggle flashlight torch"
                  >
                    <Flashlight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Upload QR File or Manual Code Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-700/80 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Scan From QR Screenshot</span>
                </button>

                {/* Quick Test Demo Button with an active booking */}
                <button
                  type="button"
                  onClick={() => {
                    const sample = bookings.find((b) => b.status === 'Ready for Pickup' || b.status === 'Confirmed') || bookings[0];
                    if (sample) processDecodedString(sample.tokenCode || sample.id);
                  }}
                  className="p-3 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 rounded-2xl border border-emerald-800/60 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Quick Test Verify Active Token</span>
                </button>
              </div>

              {/* Manual Token Code Entry Form */}
              <form onSubmit={handleManualSearch} className="pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500">#</span>
                    <input
                      type="text"
                      placeholder="Or enter Token Code manually (e.g. FD-4827)..."
                      value={manualTokenInput}
                      onChange={(e) => setManualTokenInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    <span>Verify</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ========================================================= */
            /* VERIFICATION RESULT CARD                                  */
            /* ========================================================= */
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              
              {/* Status Header */}
              {matchedBooking ? (
                <div className="bg-emerald-950/70 border border-emerald-600/50 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                        Valid Booking Verified
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded">
                        OTP: {matchedBooking.otp || '101 - 202'}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-white mt-0.5">
                      {matchedBooking.mealTitle || 'Rescued Meal'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Token: <span className="font-mono font-bold text-white">#{matchedBooking.tokenCode || matchedBooking.id}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-950/70 border border-amber-600/50 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Unmatched Voucher Token</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Scanned code: <span className="font-mono font-bold">{scannedResult.token}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      This token was not found in tonight's active bookings. It might belong to another kitchen or may be expired.
                    </p>
                  </div>
                </div>
              )}

              {/* Booking Details Breakdown */}
              {matchedBooking && (
                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer</span>
                      <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{matchedBooking.customerName || 'Diner'}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {matchedBooking.customerPhone || '+91 98765 43210'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Quantity & Amount</span>
                      <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{matchedBooking.portions || 1} Rescue Parcel(s)</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-bold mt-0.5">
                        ₹{matchedBooking.totalPaid || matchedBooking.mealSubtotal || 0} • Paid via UPI
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Pickup Window:</span>
                    <span className="font-semibold text-white">{matchedBooking.pickupWindow || 'Tonight'}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Current Booking Status:</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      matchedBooking.status === 'Completed'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {matchedBooking.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Handover Action or Success State */}
              {handoverSuccess || matchedBooking?.status === 'Completed' ? (
                <div className="p-4 bg-emerald-900/60 border border-emerald-500 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white">Food Parcel Handover Completed!</h4>
                  <p className="text-xs text-emerald-200">
                    The token has been marked completed in real time. Escrow payment released to your restaurant balance.
                  </p>
                </div>
              ) : matchedBooking ? (
                <button
                  type="button"
                  onClick={handleConfirmHandover}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Release Food & Confirm Handover (1-Click)</span>
                </button>
              ) : null}

              {/* Scan Next / Return to Camera */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleScanNext}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Scan Another Voucher</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Help / Note */}
        <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FSSAI Compliant Handover Ledger</span>
          </div>
          <span className="font-mono text-slate-500">Camera: {facingMode === 'environment' ? 'Rear / Counter' : 'Front'}</span>
        </div>

      </div>
    </div>
  );
}
