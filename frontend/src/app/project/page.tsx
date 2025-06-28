import { Hero, HeroDescription, HeroTitle } from '@/components/hero';

export default function Page() {
    return (
        <div className="space-y-6 p-6">
            <Hero>
                <HeroTitle className="text-rose-500">Project List</HeroTitle>
                <HeroDescription>
                    Explore all projects created by people around the work
                </HeroDescription>
            </Hero>
        </div>
    );
}
