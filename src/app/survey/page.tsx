
import { VillageSurvey } from '@/components/village-survey';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function SurveyPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Village Survey</h1>
                <p className="text-muted-foreground mt-2">
                    Tell us about your village. The more accurate you are, the better our AI can help you.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Village Details</CardTitle>
                    <CardDescription>
                        Use the sliders to set the level for each item in your village. If you don't have an item, leave it at level 0.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <VillageSurvey />
                </CardContent>
            </Card>
        </div>
    );
}
