import { PracticeQuestionList } from '@/components/practice-question-list';
import { getQuestions } from '@/service/question';

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const questions = await getQuestions(id);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
                <PracticeQuestionList questions={questions} />
            </div>
        </div>
    );
}
