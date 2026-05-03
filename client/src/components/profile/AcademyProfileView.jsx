import React from 'react';
import { Download } from 'lucide-react';

const AcademyProfileView = ({ data }) => {
  return (
    <div className="bg-white max-w-4xl mx-auto p-10 font-sans text-slate-800 shadow-xl border border-slate-200">
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-10 border-b-4 border-slate-900 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wider">Sample Academy Profile Page</h1>
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold text-slate-600">Name of the Institution :</span> {data.academyName || 'Veranda Race or Shankar IAS Academy'}</p>
            <div className="flex gap-6">
              <p><span className="font-semibold text-slate-600">Contact No :</span> {data.contactNumber || '9589075670'}</p>
              <p><span className="font-semibold text-slate-600">Alternate No :</span> {data.altContact || '7608411373'}</p>
            </div>
            <p><span className="font-semibold text-slate-600">Email :</span> {data.email || 'adminverandarace@rediffmail.com'}</p>
            <p><span className="font-semibold text-slate-600">Alternate Email :</span> {data.altEmail || 'admin_shankarias@academy.com'}</p>
          </div>
        </div>
        
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-slate-50 border border-slate-200 p-2 flex items-center justify-center mb-2 overflow-hidden">
             {data.logo ? (
                <img src={data.logo} alt="Logo" className="w-full h-full object-contain" />
             ) : (
                <div className="text-center text-slate-400">
                  <div className="text-4xl mb-1">🌤️</div>
                  <div className="text-2xl text-green-500">🍃</div>
                </div>
             )}
          </div>
          <span className="font-bold text-slate-900">Logo</span>
        </div>
      </div>

      {/* Addresses */}
      <div className="space-y-6 mb-10 text-sm">
        <div>
          <h3 className="font-semibold mb-3">Temporary Address</h3>
          <div className="space-y-2 ml-4">
            <p><span className="font-semibold text-slate-600">Door No :</span> {data.tempAddress?.doorNo || '47/24'}</p>
            <p><span className="font-semibold text-slate-600">Address Line 1: Road /Street Name :</span> {data.tempAddress?.line1 || 'Periya Metttu Palayam Road,'}</p>
            <p><span className="font-semibold text-slate-600">Address Line 2:</span> {data.tempAddress?.line2 || 'Kaladipet, Thiruvottiyur'}</p>
            <p><span className="font-semibold text-slate-600">Town / City:</span> {data.tempAddress?.city || 'Chennai'}</p>
            <p><span className="font-semibold text-slate-600">District:</span> {data.tempAddress?.district || 'Chennai'}</p>
            <p><span className="font-semibold text-slate-600">State:</span> {data.tempAddress?.state || 'TamilNadu'}</p>
            <p><span className="font-semibold text-slate-600">Pincode :</span> {data.tempAddress?.pincode || '600019'}</p>
            <p><span className="font-semibold text-slate-600">Land Mark :</span> {data.tempAddress?.landmark || 'Opp Rajiv Nagar 1st Street'}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-3">
            <h3 className="font-semibold">Permanent Address</h3>
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" checked={data.sameAsAbove} readOnly className="w-4 h-4 accent-slate-900" />
              Kindly Tick Same As Above
            </label>
          </div>
          
          {!data.sameAsAbove && (
            <div className="space-y-1 ml-4 text-slate-700">
              <p className="font-semibold text-slate-900 mb-1">Different</p>
              <p>Door No: {data.permAddress?.doorNo || '17/21'}</p>
              <p>Road /Street : {data.permAddress?.line1 || 'VIP Nagar,'}</p>
              <p>{data.permAddress?.line2 || 'R.M.Colony 8th Crosss'}</p>
              <p>{data.permAddress?.city || 'Dindigul'}</p>
              <p>{data.permAddress?.district || 'Nellore'}</p>
              <p>{data.permAddress?.state || 'Andhra Pradesh'}</p>
              <p>{data.permAddress?.pincode || '524001'}</p>
              <p>Land Mark {data.permAddress?.landmark || 'Behind Nellore Central Busstand'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Registration Details */}
      <div className="space-y-2 mb-8 text-sm">
        <div className="flex items-center gap-4">
          <p><span className="font-semibold text-slate-600">GST No:</span> {data.gst || 'AAGCG3456779TRU2026'}</p>
          <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-300 px-2 py-1 bg-slate-50">
            <Download size={12}/> View
          </button>
        </div>
        <div className="flex items-center gap-4">
          <p><span className="font-semibold text-slate-600">Academy Registration No :</span> {data.regNumber || 'TRY4852/2026'}</p>
          <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-300 px-2 py-1 bg-slate-50">
            <Download size={12}/> View
          </button>
        </div>
      </div>

      {/* Coaching Details */}
      <div className="space-y-2 mb-12 text-sm">
        <p><span className="font-semibold text-slate-600">Coaching Group :</span> {data.coachingGroup || 'OMR'}</p>
        <p><span className="font-semibold text-slate-600">Coaching Exam :</span> {data.coachingExam || 'UPSC'}</p>
        <div className="flex items-center gap-6">
          <span className="font-semibold text-slate-600">Question Type :</span>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.questionType?.mcq ?? true} readOnly className="w-4 h-4 accent-slate-900"/> MCQ,
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.questionType?.mains ?? true} readOnly className="w-4 h-4 accent-slate-900"/> Mains Paragraph
          </label>
        </div>
      </div>

      {/* Divider */}
      <div className="h-4 bg-slate-800 w-[calc(100%+5rem)] -ml-10 mb-10"></div>

      {/* Authorized Person */}
      <div className="space-y-6 text-sm">
        <div>
          <h3 className="font-semibold mb-2">Authorized Person Details</h3>
          <div className="space-y-2 ml-4">
            <p><span className="font-semibold text-slate-600">Name;</span> {data.authName || 'M.Ganesan'}</p>
            <p><span className="font-semibold text-slate-600">Contact No:</span> {data.authContact || '8438888690'}</p>
            <p><span className="font-semibold text-slate-600">Email:</span> {data.authEmail || 'jeevanganesh@gmail.com'}</p>
          </div>
        </div>

        {/* Document Verification */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <p><span className="font-semibold text-slate-600">Proof of Identity :</span> {data.idProofType || 'Academy ID'}</p>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-300 px-2 py-1 bg-slate-50">
              <Download size={12}/> View
            </button>
          </div>
          <div className="flex items-center gap-4">
            <p><span className="font-semibold text-slate-600">Proof of Address :</span> {data.addressProofType || 'Offer /Appointment Letter'}</p>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-300 px-2 py-1 bg-slate-50">
              <Download size={12}/> View
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AcademyProfileView;
