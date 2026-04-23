'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, UserPlus, LogIn, Store, Building2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { registerUser, submitVendorApplication } from './actions';

type LoginMode = 'CUSTOMER' | 'VENDOR' | 'VENDOR_APPLY';

export default function LoginPage() {
    const [mode, setMode] = useState<LoginMode>('CUSTOMER');
    const [isRegistering, setIsRegistering] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shopName, setShopName] = useState('');
    const [phone, setPhone] = useState('');

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        if (mode === 'VENDOR_APPLY') {
            const res = await submitVendorApplication({ shopName, name, email, phone });
            if (res.success) {
                setSuccessMsg("Application submitted! Our partnership team will review your restaurant and contact you shortly with terminal access credentials.");
                setMode('VENDOR');
                setShopName(''); setName(''); setEmail(''); setPhone('');
            } else {
                setError(res.error || "Failed to submit application.");
            }
            setLoading(false);
            return;
        }

        if (mode === 'CUSTOMER' && isRegistering) {
            const res = await registerUser({ name, email, password });
            if (!res.success) {
                setError(res.error || "Failed to register.");
                setLoading(false);
                return;
            }
        }

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError('Invalid credentials.');
            setLoading(false);
        } else {
            const res = await fetch('/api/auth/session');
            const session = await res.json();

            if (session?.user?.role === "VENDOR") {
                router.push('/vendor/dashboard');
            } else if (session?.user?.role === "ADMIN") {
                router.push('/admin/applications');
            } else {
                router.push('/');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative pt-20">
            {/* Decorative Blur */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-orange-500/10 dark:bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-orange-500/10 border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10">

                {/* Left Side Navigation (Modes) */}
                <div className="md:w-1/3 bg-slate-50 dark:bg-slate-800/30 p-8 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                        <Link href="/" className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-8 hover:scale-105 transition-transform">
                            <Leaf className="text-white w-6 h-6" />
                        </Link>

                        <div className="space-y-3">
                            <button
                                onClick={() => { setMode('CUSTOMER'); setError(''); setSuccessMsg(''); }}
                                className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all font-bold ${mode === 'CUSTOMER' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mode === 'CUSTOMER' ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                    <UserPlus className="w-4 h-4" />
                                </div>
                                Customer Access
                            </button>
                            <button
                                onClick={() => { setMode('VENDOR'); setError(''); setSuccessMsg(''); }}
                                className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all font-bold ${mode === 'VENDOR' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mode === 'VENDOR' ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                    <Store className="w-4 h-4" />
                                </div>
                                Vendor Login
                            </button>
                            <button
                                onClick={() => { setMode('VENDOR_APPLY'); setError(''); setSuccessMsg(''); }}
                                className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all font-bold ${mode === 'VENDOR_APPLY' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mode === 'VENDOR_APPLY' ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                    <Building2 className="w-4 h-4" />
                                </div>
                                Partner With Us
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side Rendering Forms */}
                <div className="md:w-2/3 p-8 md:p-12">

                    {/* Headers dynamically based on mode */}
                    <div className="mb-10">
                        {mode === 'CUSTOMER' && (
                            <>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Welcome to MintMart</h1>
                                <p className="text-slate-500 font-medium">Order from the best restaurants in town.</p>

                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mt-6 max-w-sm">
                                    <button type="button" onClick={() => setIsRegistering(false)} className={`flex-1 flex justify-center items-center gap-2 py-3 font-bold rounded-xl transition-all ${!isRegistering ? 'bg-white dark:bg-slate-900 shadow-sm text-orange-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                        <LogIn className="w-4 h-4" /> Sign In
                                    </button>
                                    <button type="button" onClick={() => setIsRegistering(true)} className={`flex-1 flex justify-center items-center gap-2 py-3 font-bold rounded-xl transition-all ${isRegistering ? 'bg-white dark:bg-slate-900 shadow-sm text-orange-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                        <UserPlus className="w-4 h-4" /> Register
                                    </button>
                                </div>
                            </>
                        )}

                        {mode === 'VENDOR' && (
                            <>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Vendor Terminal</h1>
                                <p className="text-slate-500 font-medium">Securely access your restaurant management dashboard.</p>
                            </>
                        )}

                        {mode === 'VENDOR_APPLY' && (
                            <>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Become a Partner</h1>
                                <p className="text-slate-500 font-medium">Apply to bring your restaurant onto MintMart. We will provision your credentials upon approval.</p>
                            </>
                        )}
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 text-sm font-bold border border-red-100 dark:border-red-500/20 flex items-center gap-3">
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-sm font-bold border border-emerald-100 dark:border-emerald-500/20 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                            {successMsg}
                        </div>
                    )}

                    {/* Shared Form Element */}
                    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300 relative">

                        {(mode === 'VENDOR_APPLY' || (mode === 'CUSTOMER' && isRegistering)) && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="E.g. John Doe" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl px-5 py-4 outline-none font-medium" />
                            </div>
                        )}

                        {mode === 'VENDOR_APPLY' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Restaurant Name</label>
                                <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} required placeholder="E.g. Luigi's Pizza" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl px-5 py-4 outline-none font-medium" />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@address.com" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl px-5 py-4 outline-none font-medium" />
                        </div>

                        {mode === 'VENDOR_APPLY' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Phone Number</label>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+1 234 567 890" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl px-5 py-4 outline-none font-medium" />
                            </div>
                        )}

                        {mode !== 'VENDOR_APPLY' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl px-5 py-4 outline-none font-medium" />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full primary-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 mt-6"
                        >
                            {loading ? 'Processing...' : mode === 'VENDOR_APPLY' ? 'Submit Application' : (mode === 'CUSTOMER' && isRegistering) ? 'Create Customer Account' : 'Sign In'}
                        </button>
                    </form>

                    {mode === 'VENDOR' && (
                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-slate-500 text-sm font-medium">Demo Vendor Credentials:</p>
                            <p className="text-slate-800 dark:text-slate-300 font-bold text-sm mt-1">vendor@mintmart.local / password123</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
