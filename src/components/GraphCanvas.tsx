import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Download } from 'lucide-react';
import { InverseSolution } from '../types/math';

interface GraphCanvasProps {
  solution: InverseSolution;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ solution }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState<number>(35); // pixels per math unit
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [probeX, setProbeX] = useState<number>(1);
  const [showMirrorLine, setShowMirrorLine] = useState(true);
  const [showProbe, setShowProbe] = useState(true);

  // Reset view
  const handleReset = () => {
    setScale(35);
    setOffset({ x: 0, y: 0 });
    setProbeX(1);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const originX = width / 2 + offset.x;
    const originY = height / 2 + offset.y;

    // Clear background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.lineWidth = 1;
    const step = scale; // 1 math unit
    const minMathX = Math.floor((-originX) / scale);
    const maxMathX = Math.ceil((width - originX) / scale);
    const minMathY = Math.floor((originY - height) / scale);
    const maxMathY = Math.ceil(originY / scale);

    // Subgrid / Minor Grid
    ctx.strokeStyle = '#f1f5f9';
    const subStep = scale >= 50 ? scale / 5 : scale / 2;
    for (let x = originX % subStep; x < width; x += subStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = originY % subStep; y < height; y += subStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Major Grid
    ctx.strokeStyle = '#e2e8f0';
    for (let mx = minMathX; mx <= maxMathX; mx++) {
      const cx = originX + mx * scale;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();
    }
    for (let my = minMathY; my <= maxMathY; my++) {
      const cy = originY - my * scale;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();
    }

    // Main Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Tick Numbers
    ctx.fillStyle = '#64748b';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let mx = minMathX; mx <= maxMathX; mx++) {
      if (mx === 0) continue;
      const cx = originX + mx * scale;
      ctx.fillText(mx.toString(), cx, originY + 4);
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let my = minMathY; my <= maxMathY; my++) {
      if (my === 0) continue;
      const cy = originY - my * scale;
      ctx.fillText(my.toString(), originX - 4, cy);
    }
    // Origin (0,0)
    ctx.fillText('0', originX - 4, originY + 12);

    // Axis Labels
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('x', width - 12, originY - 14);
    ctx.fillText('y', originX + 16, 12);

    // Draw Mirror Line: y = x (Dashed Line)
    if (showMirrorLine) {
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      const leftY = originY - (-originX / scale) * scale;
      const rightY = originY - ((width - originX) / scale) * scale;
      ctx.moveTo(0, leftY);
      ctx.lineTo(width, rightY);
      ctx.stroke();
      ctx.restore();

      // Label for y = x
      ctx.fillStyle = '#b45309';
      ctx.font = 'italic 12px serif';
      const labelX = width - 40;
      const labelY = originY - ((labelX - originX) / scale) * scale - 12;
      if (labelY > 20 && labelY < height - 20) {
        ctx.fillText('y = x', labelX, labelY);
      }
    }

    // Helper: Screen to Math & Math to Screen
    const toScreen = (mx: number, my: number) => ({
      x: originX + mx * scale,
      y: originY - my * scale,
    });

    // Draw Original Function f(x) (Blue)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    let started = false;
    const pxStep = 1.5;

    for (let cx = 0; cx <= width; cx += pxStep) {
      const mx = (cx - originX) / scale;
      const my = solution.evaluateOriginal(mx);
      if (my === null || !isFinite(my) || Math.abs(my) > 100) {
        started = false;
        continue;
      }
      const pt = toScreen(mx, my);
      if (pt.y < -50 || pt.y > height + 50) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(pt.x, pt.y);
        started = true;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();

    // Draw Inverse Function f^{-1}(x) (Emerald)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    started = false;

    for (let cx = 0; cx <= width; cx += pxStep) {
      const mx = (cx - originX) / scale;
      const my = solution.evaluateInverse(mx);
      if (my === null || !isFinite(my) || Math.abs(my) > 100) {
        started = false;
        continue;
      }
      const pt = toScreen(mx, my);
      if (pt.y < -50 || pt.y > height + 50) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(pt.x, pt.y);
        started = true;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();

    // Draw Interactive Probe & Reflection Line
    if (showProbe) {
      const origY = solution.evaluateOriginal(probeX);
      if (origY !== null && isFinite(origY)) {
        const ptA = toScreen(probeX, origY);
        // Swapped coordinates for the inverse!
        const invX = origY;
        const invY = probeX;
        const ptB = toScreen(invX, invY);

        // Reflection Line connecting (a, b) and (b, a)
        ctx.save();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ptA.x, ptA.y);
        ctx.lineTo(ptB.x, ptB.y);
        ctx.stroke();

        // Midpoint on y = x
        const midX = (ptA.x + ptB.x) / 2;
        const midY = (ptA.y + ptB.y) / 2;
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(midX, midY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Point on f(x)
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(ptA.x, ptA.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Point on f^{-1}(x)
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(ptB.x, ptB.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Callout tags
        ctx.font = 'bold 11px system-ui, sans-serif';
        // Label A
        ctx.fillStyle = '#1e3a8a';
        const labelAText = `(${probeX.toFixed(1)}, ${origY.toFixed(1)}) on f(x)`;
        ctx.fillText(labelAText, ptA.x + 8, ptA.y - 8);

        // Label B
        ctx.fillStyle = '#065f46';
        const labelBText = `(${invX.toFixed(1)}, ${invY.toFixed(1)}) on f⁻¹(x)`;
        ctx.fillText(labelBText, ptB.x + 8, ptB.y - 8);
      }
    }
  }, [solution, scale, offset, probeX, showMirrorLine, showProbe]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // Mouse drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setScale((prev) => Math.min(Math.max(prev * zoomFactor, 10), 180));
  };

  // Export Canvas Image
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'inverse-function-graph.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Graph Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-sm">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-800">Visual Reflection Plane</span>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block mr-1"></span>
              <span className="text-slate-700 font-medium">f(x)</span>
            </span>
            <span className="flex items-center">
              <span className="w-3 h-1 bg-amber-500 inline-block mr-1"></span>
              <span className="text-slate-700 font-medium">y = x</span>
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block mr-1"></span>
              <span className="text-slate-700 font-medium">f⁻¹(x)</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowMirrorLine(!showMirrorLine)}
            title="Toggle line y = x"
            className={`px-2 py-1 text-xs rounded border transition flex items-center gap-1 ${
              showMirrorLine ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> y=x
          </button>
          <button
            onClick={() => setShowProbe(!showProbe)}
            title="Toggle coordinate swap probe"
            className={`px-2 py-1 text-xs rounded border transition flex items-center gap-1 ${
              showProbe ? 'bg-purple-50 text-purple-800 border-purple-300' : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> (a,b)↔(b,a)
          </button>
          <div className="h-4 w-px bg-slate-300 mx-1" />
          <button
            onClick={() => setScale((s) => Math.min(s * 1.25, 180))}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s * 0.8, 10))}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition"
            title="Download Graph Image"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[360px] md:h-[420px] bg-white cursor-grab active:cursor-grabbing select-none">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />

        {/* Floating probe slider */}
        {showProbe && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-lg p-2.5 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Probe x-value:</span>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.2"
                value={probeX}
                onChange={(e) => setProbeX(parseFloat(e.target.value))}
                className="w-32 accent-blue-600"
              />
              <span className="font-mono font-semibold text-blue-700 w-8">{probeX.toFixed(1)}</span>
            </div>
            <div className="text-slate-600 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              <span>Notice how <strong>(a, b)</strong> flips across <strong>y = x</strong> to become <strong>(b, a)</strong>!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
