import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Clock, Beaker, Shield, ChevronRight, Activity, Tag, Zap, Star } from 'lucide-react';

const BloodTestCard = ({ test }) => {
  const discount = Number(test.discount) || 0;
  const hasDiscount = discount > 0;
  const mrp = hasDiscount ? (test.mrp || Math.round(test.price / (1 - discount / 100))) : null;
  const isFeatured = test.featured;
  const isHotDeal = hasDiscount && discount >= 20;

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border border-slate-100 bg-white hover:border-medical-error/30 hover:shadow-2xl hover:shadow-red-500/8 transition-all duration-500 ease-out rounded-3xl">

      {/* ── Hot Deal Ribbon (top-left corner) ── */}
      {isHotDeal && (
        <div className="absolute top-0 left-0 z-20">
          <div className="relative">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-br-xl rounded-tl-3xl flex items-center gap-1 shadow-lg">
              <Zap size={9} className="fill-white" />
              Hot Deal
            </div>
          </div>
        </div>
      )}

      {/* ── Featured Star Badge (top-left, when no hot deal) ── */}
      {isFeatured && !isHotDeal && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-amber-50 border border-amber-200 text-amber-600 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star size={8} className="fill-amber-500 text-amber-500" />
            Popular
          </div>
        </div>
      )}

      {/* ── Decorative Background Blob ── */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-medical-error/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 group-hover:bg-medical-error/8 transition-all duration-700 ease-out pointer-events-none" />

      {/* ══════════════════════════════════════
          TOP SECTION — Icon + Category + Name
      ══════════════════════════════════════ */}
      <div className="p-5 pb-3 relative z-10 flex-1">

        {/* Row: Icon + Category Badge */}
        <div className="flex justify-between items-start mb-4 mt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-blue-50 border border-red-100/50 flex items-center justify-center text-medical-error group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <Badge className="bg-blue-50 text-blue-600 border border-blue-100 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full">
            {test.category || 'General'}
          </Badge>
        </div>

        {/* Test Name */}
        <h3 className="text-[15px] font-black text-txt-dark leading-snug mb-1 group-hover:text-medical-error transition-colors duration-300 line-clamp-2">
          {test.test_name}
        </h3>

        {/* Lab Name */}
        <p className="text-xs text-txt-secondary font-semibold flex items-center gap-1.5 mb-4">
          <Shield className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="truncate">{test.lab_name || 'Certified Lab'}</span>
        </p>

        {/* ── Offer Banner (shown only when discount exists) ── */}
        {hasDiscount && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
            <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-black text-emerald-700 tracking-tight">
              Save ₹{mrp - test.price} on this test!
            </span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          BOTTOM SECTION — Details + Price
      ══════════════════════════════════════ */}
      <div className="px-5 py-4 bg-slate-50/70 border-t border-slate-100 relative z-10">

        {/* Report Time + Sample Type */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div>
              <p className="text-[9px] text-txt-placeholder font-bold uppercase tracking-tighter leading-none mb-0.5">Report In</p>
              <p className="text-[11px] font-bold text-txt-dark leading-none">{test.report_time || '24 Hrs'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
              <Beaker className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div>
              <p className="text-[9px] text-txt-placeholder font-bold uppercase tracking-tighter leading-none mb-0.5">Sample</p>
              <p className="text-[11px] font-bold text-txt-dark leading-none">{test.sample_type || 'Blood'}</p>
            </div>
          </div>
        </div>

        {/* Price Row + Book Button */}
        <div className="flex items-end justify-between gap-2">
          {/* Pricing */}
          <div>
            {/* Discount Badge — only shown when discount > 0 */}
            {hasDiscount && (
              <span className="inline-block bg-red-100 text-medical-error text-[10px] font-black px-2 py-0.5 rounded-md mb-1 tracking-tight">
                {discount}% OFF
              </span>
            )}
            {/* MRP Strikethrough — only shown when discount > 0 and mrp exists */}
            {hasDiscount && mrp && (
              <p className="text-[11px] text-txt-placeholder line-through leading-none mb-0.5 font-semibold">
                ₹{Number(mrp).toLocaleString('en-IN')}
              </p>
            )}
            {/* Final Price */}
            <p className="text-xl font-black text-txt-dark leading-none">
              ₹{Number(test.price).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Book Button */}
          <Link to={`/blood-tests/${test.id}`} className="shrink-0">
            <Button className="rounded-2xl bg-gradient-to-r from-medical-error to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 text-white font-black h-11 px-5 transition-all duration-300 group/btn">
              <span className="flex items-center gap-1.5 text-sm">
                Book
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BloodTestCard;
