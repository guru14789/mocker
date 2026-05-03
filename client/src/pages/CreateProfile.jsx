import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { 
  User, Building2, ChevronRight, ChevronLeft, CheckCircle2, 
  Upload, FileText, FileBadge, ArrowRight, Download
} from 'lucide-react';
import AcademyProfileView from '../components/profile/AcademyProfileView';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profileType, setProfileType] = useState(null); // 'academy' | 'aspirant'
  const [loading, setLoading] = useState(false);
  
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    // Shared
    email: '',
    contactNumber: '',
    address: '',
    // Academy Basic
    academyName: '',
    contactNumber: '',
    altContact: '',
    email: '',
    altEmail: '',
    // Addresses
    tempDoorNo: '', tempLine1: '', tempLine2: '', tempCity: '', tempDistrict: '', tempState: '', tempPincode: '', tempLandmark: '',
    permDoorNo: '', permLine1: '', permLine2: '', permCity: '', permDistrict: '', permState: '', permPincode: '', permLandmark: '',
    sameAsAbove: false,
    // Business & Coaching
    gst: '',
    regNumber: '',
    coachingGroup: 'OMR',
    coachingExam: 'UPSC',
    questionTypeMcq: true,
    questionTypeMains: false,
    // Auth Person
    authName: '',
    authContact: '',
    authEmail: '',
    idProofType: 'Academy ID',
    addressProofType: 'Offer /Appointment Letter',
    // Aspirant
    name: '',
    gender: 'Male',
    age: '',
    residentialType: 'Permanent',
    category: 'Self',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleNext = () => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, 
        { opacity: 0, x: 20 }, 
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
    setStep(prev => prev - 1);
  };

  const { updateProfile } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setStep('SUCCESS');
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [step]);

  const inputCls = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-sm text-slate-700';
  const labelCls = 'text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1 mb-1 block';

  // Render Step 1: Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-outfit">
        <div ref={formRef} className="max-w-3xl w-full bg-white rounded-[2rem] shadow-xl p-10 lg:p-16 border border-slate-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Choose Your Profile</h1>
            <p className="text-slate-500 font-medium">Select the account type that best describes you to continue.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div 
              onClick={() => { setProfileType('academy'); handleNext(); }}
              className="group cursor-pointer border-2 border-slate-100 hover:border-[#0F172A] rounded-3xl p-8 transition-all hover:shadow-xl hover:shadow-slate-200/50 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-slate-50 group-hover:bg-[#0F172A] rounded-2xl flex items-center justify-center transition-colors mb-6">
                <Building2 size={32} className="text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Academy Profile</h2>
              <p className="text-sm text-slate-500 mb-6">For institutions, coaching centers, and educational organizations.</p>
              <div className="mt-auto flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-[#0F172A] uppercase tracking-widest">
                Select <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => { setProfileType('aspirant'); handleNext(); }}
              className="group cursor-pointer border-2 border-slate-100 hover:border-indigo-600 rounded-3xl p-8 transition-all hover:shadow-xl hover:shadow-indigo-600/10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-slate-50 group-hover:bg-indigo-600 rounded-2xl flex items-center justify-center transition-colors mb-6">
                <User size={32} className="text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Aspirant Profile</h2>
              <p className="text-sm text-slate-500 mb-6">For individual students and candidates preparing for exams.</p>
              <div className="mt-auto flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest">
                Select <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Success Step
  if (step === 'SUCCESS') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-outfit">
        <div ref={formRef} className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-12 border border-slate-100 text-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Profile Created!</h1>
          <p className="text-slate-500 text-sm mb-8">Your {profileType} profile has been successfully set up and securely stored.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-black text-xs uppercase tracking-[.2em] hover:bg-slate-800 transition-all shadow-md"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Navigation UI Wrapper
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-outfit">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-[2rem] overflow-hidden flex flex-col min-h-[600px] border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
              {profileType === 'academy' ? <Building2 size={20} className="text-indigo-400" /> : <User size={20} className="text-indigo-400" />}
              {profileType === 'academy' ? 'Academy Profile Setup' : 'Aspirant Profile Setup'}
            </h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
              Step {step - 1} of {profileType === 'academy' ? '4' : '3'}
            </p>
          </div>
          <button onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 lg:p-12 flex-1 overflow-y-auto" ref={formRef}>
          
          {/* ────────────────────────────────────────────────────────────
              ACADEMY FLOW 
             ──────────────────────────────────────────────────────────── */}
          {profileType === 'academy' && (
            <>
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Basic Details</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="md:col-span-2"><label className={labelCls}>Academy Name</label><input type="text" name="academyName" value={formData.academyName} onChange={handleChange} className={inputCls} placeholder="Name of the Institution" /></div>
                    <div><label className={labelCls}>Contact No</label><input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={inputCls} placeholder="+91 0000000000" /></div>
                    <div><label className={labelCls}>Alternate No</label><input type="tel" name="altContact" value={formData.altContact} onChange={handleChange} className={inputCls} placeholder="+91 0000000000" /></div>
                    <div><label className={labelCls}>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="academy@example.com" /></div>
                    <div><label className={labelCls}>Alternate Email</label><input type="email" name="altEmail" value={formData.altEmail} onChange={handleChange} className={inputCls} placeholder="alt@example.com" /></div>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mt-8">Temporary Address</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div><label className={labelCls}>Door No</label><input type="text" name="tempDoorNo" value={formData.tempDoorNo} onChange={handleChange} className={inputCls} /></div>
                    <div><label className={labelCls}>Road / Street Name</label><input type="text" name="tempLine1" value={formData.tempLine1} onChange={handleChange} className={inputCls} /></div>
                    <div><label className={labelCls}>Address Line 2</label><input type="text" name="tempLine2" value={formData.tempLine2} onChange={handleChange} className={inputCls} /></div>
                    <div><label className={labelCls}>Town / City</label><input type="text" name="tempCity" value={formData.tempCity} onChange={handleChange} className={inputCls} /></div>
                    <div><label className={labelCls}>District</label><input type="text" name="tempDistrict" value={formData.tempDistrict} onChange={handleChange} className={inputCls} /></div>
                    <div><label className={labelCls}>State</label><input type="text" name="tempState" value={formData.tempState} onChange={handleChange} className={inputCls} /></div>
                    <div><label className={labelCls}>Pincode</label><input type="text" name="tempPincode" value={formData.tempPincode} onChange={handleChange} className={inputCls} /></div>
                    <div><label className={labelCls}>Landmark</label><input type="text" name="tempLandmark" value={formData.tempLandmark} onChange={handleChange} className={inputCls} /></div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mt-8">
                    <h3 className="text-lg font-black text-slate-900">Permanent Address</h3>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
                      <input type="checkbox" name="sameAsAbove" checked={formData.sameAsAbove} onChange={handleChange} className="w-4 h-4 accent-indigo-600" />
                      Kindly Tick Same As Above
                    </label>
                  </div>
                  
                  {!formData.sameAsAbove && (
                    <div className="grid md:grid-cols-2 gap-5">
                      <div><label className={labelCls}>Door No</label><input type="text" name="permDoorNo" value={formData.permDoorNo} onChange={handleChange} className={inputCls} /></div>
                      <div><label className={labelCls}>Road / Street Name</label><input type="text" name="permLine1" value={formData.permLine1} onChange={handleChange} className={inputCls} /></div>
                      <div><label className={labelCls}>Address Line 2</label><input type="text" name="permLine2" value={formData.permLine2} onChange={handleChange} className={inputCls} /></div>
                      <div><label className={labelCls}>Town / City</label><input type="text" name="permCity" value={formData.permCity} onChange={handleChange} className={inputCls} /></div>
                      <div><label className={labelCls}>District</label><input type="text" name="permDistrict" value={formData.permDistrict} onChange={handleChange} className={inputCls} /></div>
                      <div><label className={labelCls}>State</label><input type="text" name="permState" value={formData.permState} onChange={handleChange} className={inputCls} /></div>
                      <div><label className={labelCls}>Pincode</label><input type="text" name="permPincode" value={formData.permPincode} onChange={handleChange} className={inputCls} /></div>
                      <div><label className={labelCls}>Landmark</label><input type="text" name="permLandmark" value={formData.permLandmark} onChange={handleChange} className={inputCls} /></div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Business & Coaching Details</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div><label className={labelCls}>GST Number</label><input type="text" name="gst" value={formData.gst} onChange={handleChange} className={inputCls} placeholder="22AAAAA0000A1Z5" /></div>
                    <div><label className={labelCls}>Academy Registration No</label><input type="text" name="regNumber" value={formData.regNumber} onChange={handleChange} className={inputCls} placeholder="TRY4852/2026" /></div>
                    
                    <div>
                      <label className={labelCls}>Coaching Group</label>
                      <select name="coachingGroup" value={formData.coachingGroup} onChange={handleChange} className={inputCls}>
                        <option value="OMR">OMR</option>
                        <option value="CBT">CBT</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Coaching Exam</label>
                      <select name="coachingExam" value={formData.coachingExam} onChange={handleChange} className={inputCls}>
                        <option value="UPSC">UPSC</option>
                        <option value="NEET">NEET</option>
                        <option value="JEE">JEE</option>
                        <option value="SSC">SSC</option>
                        <option value="TNPSC">TNPSC</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelCls}>Question Type</label>
                      <div className="flex items-center gap-8 mt-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                          <input type="checkbox" name="questionTypeMcq" checked={formData.questionTypeMcq} onChange={handleChange} className="w-5 h-5 accent-indigo-600" />
                          MCQ
                        </label>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                          <input type="checkbox" name="questionTypeMains" checked={formData.questionTypeMains} onChange={handleChange} className="w-5 h-5 accent-indigo-600" />
                          Mains Paragraph
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2 mt-4">
                      <label className={labelCls}>Academy Logo</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                        <Upload size={24} className="text-slate-400 mb-2" />
                        <span className="text-sm font-bold text-slate-600">Click to upload logo</span>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">PNG, JPG up to 2MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Authorized Person & Documents</h3>
                  <div className="grid md:grid-cols-2 gap-5 mb-8">
                    <div className="md:col-span-2"><label className={labelCls}>Authorized Person Name</label><input type="text" name="authName" value={formData.authName} onChange={handleChange} className={inputCls} placeholder="Full Name" /></div>
                    <div><label className={labelCls}>Contact Number</label><input type="tel" name="authContact" value={formData.authContact} onChange={handleChange} className={inputCls} placeholder="+91 0000000000" /></div>
                    <div><label className={labelCls}>Email ID</label><input type="email" name="authEmail" value={formData.authEmail} onChange={handleChange} className={inputCls} placeholder="auth@example.com" /></div>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">Required Documents</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-600 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                      <FileBadge size={28} className="text-indigo-400 mb-3" />
                      <span className="text-sm font-bold text-slate-700">Proof of Identity</span>
                      <span className="text-[10px] text-slate-400 mt-1">Aadhar, PAN, or Passport</span>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-600 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                      <FileText size={28} className="text-indigo-400 mb-3" />
                      <span className="text-sm font-bold text-slate-700">Proof of Address</span>
                      <span className="text-[10px] text-slate-400 mt-1">Utility Bill or Registration Cert</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="bg-slate-100 p-8 -mx-8 -my-12 flex justify-center">
                  <AcademyProfileView data={{
                    ...formData,
                    tempAddress: {
                      doorNo: formData.tempDoorNo,
                      line1: formData.tempLine1,
                      line2: formData.tempLine2,
                      city: formData.tempCity,
                      district: formData.tempDistrict,
                      state: formData.tempState,
                      pincode: formData.tempPincode,
                      landmark: formData.tempLandmark
                    },
                    permAddress: {
                      doorNo: formData.permDoorNo,
                      line1: formData.permLine1,
                      line2: formData.permLine2,
                      city: formData.permCity,
                      district: formData.permDistrict,
                      state: formData.permState,
                      pincode: formData.permPincode,
                      landmark: formData.permLandmark
                    },
                    questionType: {
                      mcq: formData.questionTypeMcq,
                      mains: formData.questionTypeMains
                    }
                  }} />
                </div>
              )}
            </>
          )}


          {/* ────────────────────────────────────────────────────────────
              ASPIRANT FLOW 
             ──────────────────────────────────────────────────────────── */}
          {profileType === 'aspirant' && (
            <>
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Personal Details</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="md:col-span-2"><label className={labelCls}>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="John Doe" /></div>
                    <div><label className={labelCls}>Email ID</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="student@example.com" /></div>
                    <div><label className={labelCls}>Contact Number</label><input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={inputCls} placeholder="+91 0000000000" /></div>
                    
                    <div>
                      <label className={labelCls}>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className={inputCls}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div><label className={labelCls}>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} className={inputCls} placeholder="e.g. 21" /></div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Additional Details</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Residential Type</label>
                      <select name="residentialType" value={formData.residentialType} onChange={handleChange} className={inputCls}>
                        <option value="Permanent">Permanent</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Hostel">Hostel / PG</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Category</label>
                      <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                        <option value="Self">Self Study</option>
                        <option value="Academy">Academy Enrolled</option>
                      </select>
                    </div>
                    <div className="md:col-span-2"><label className={labelCls}>Complete Address</label><textarea name="address" value={formData.address} onChange={handleChange} className={`${inputCls} resize-none h-24`} placeholder="Enter full address" /></div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Preview Profile</h3>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Full Name</p><p className="font-semibold text-slate-900 text-sm">{formData.name || 'N/A'}</p></div>
                      <div><p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Email</p><p className="font-semibold text-slate-900 text-sm">{formData.email || 'N/A'}</p></div>
                      <div><p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Contact</p><p className="font-semibold text-slate-900 text-sm">{formData.contactNumber || 'N/A'}</p></div>
                      <div><p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Gender & Age</p><p className="font-semibold text-slate-900 text-sm">{formData.gender}, {formData.age || 'N/A'}</p></div>
                      <div><p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Category</p><p className="font-semibold text-slate-900 text-sm">{formData.category}</p></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {((profileType === 'academy' && step === 5) || (profileType === 'aspirant' && step === 4)) ? (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
            >
              {loading ? 'Submitting...' : 'Submit Profile'} <CheckCircle2 size={16} />
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#0F172A] text-white hover:bg-slate-800 transition-all shadow-md flex items-center gap-2"
            >
              Continue <ChevronRight size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CreateProfile;
