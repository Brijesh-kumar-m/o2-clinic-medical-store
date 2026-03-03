import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Clock, Beaker, Shield, ChevronRight, Activity } from 'lucide-react';

const BloodTestCard = ({ test }) => {
  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border-surface-border bg-white hover:border-medical-error/30 hover:shadow-2xl transition-all duration-500 ease-out rounded-3xl group">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-medical-error/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700 ease-out" />

      {/* Icon & Category Section */}
      <div className="p-6 pb-0 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-medical-error/10 to-blue-500/10 flex items-center justify-center text-medical-error group-hover:scale-110 transition-transform duration-500">
            <Activity className="w-7 h-7" />
          </div>
          <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1">
            {test.category || 'General'}
          </Badge>
        </div>

        <h3 className="text-xl font-black text-txt-dark leading-tight mb-2 group-hover:text-medical-error transition-colors duration-300">
          {test.test_name}
        </h3>
        <p className="text-sm text-txt-secondary font-medium flex items-center gap-1.5 mb-4">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          {test.lab_name || 'Certified Lab'}
        </p>
      </div>

      {/* Details Section */}
      <div className="px-6 py-4 flex flex-col gap-3 relative z-10 bg-slate-50/50 mt-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white shadow-sm">
              <Clock className="w-3.5 h-3.5 text-medical-warning" />
            </div>
            <div>
              <p className="text-[10px] text-txt-placeholder font-bold uppercase tracking-tighter">Report In</p>
              <p className="text-xs font-bold text-txt-dark">{test.report_time || '24 Hours'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white shadow-sm">
              <Beaker className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] text-txt-placeholder font-bold uppercase tracking-tighter">Sample</p>
              <p className="text-xs font-bold text-txt-dark">{test.sample_type || 'Blood'}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/50 pt-4 flex items-center justify-between mt-2">
          <div>
            <p className="text-[10px] text-txt-placeholder font-bold uppercase tracking-tight">Best Price</p>
            <p className="text-2xl font-black text-txt-dark">₹{test.price}</p>
          </div>
          <Link to={`/blood-tests/${test.id}`}>
            <Button className="rounded-2xl bg-gradient-to-r from-medical-error to-red-600 hover:shadow-lg hover:shadow-red-500/20 text-white font-bold h-12 px-6 group/btn">
              <span className="flex items-center gap-2">
                Book <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BloodTestCard;
