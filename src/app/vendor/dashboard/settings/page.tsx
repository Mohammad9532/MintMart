import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col justify-center items-center py-20">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-6">
                <SettingsIcon className="w-12 h-12 text-slate-500" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 font-medium text-lg text-center max-w-lg">
                Your settings and billing details will appear here soon.
            </p>
        </div>
    );
}
