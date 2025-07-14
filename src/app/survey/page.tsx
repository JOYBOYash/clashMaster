
"use client";

import { useAuth } from "@/context/auth-context";
import { redirect } from "next/navigation";
import { VillageSurvey } from "@/components/village-survey";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function SurveyPage() {
    const { user, loading, villageState, saveVillageState } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        redirect('/sign-in');
    }

    if (villageState) {
        redirect('/upgrades');
    }

    return (
        <div className='w-full h-full flex items-center justify-center'>
             <VillageSurvey onSurveyComplete={saveVillageState} />
        </div>
    );
}
