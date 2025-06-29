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
        <div className='flex min-h-svh w-full flex-col items-center justify-center mx-auto'>
            <PracticeQuestionList questions={questions} />
        </div>
    );
}
