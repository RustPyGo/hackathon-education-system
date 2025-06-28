import { Hero, HeroDescription, HeroTitle } from '@/components/hero';
import { ProjectCard } from '@/components/project-card';
import { getProjects } from '@/service/project';

export default async function Page() {
    const projects = await getProjects();

    return (
        <div className="container mx-auto px-4 py-8">
            <Hero>
                <HeroTitle className="text-rose-500">Project List</HeroTitle>
                <HeroDescription>
                    Explore all projects created by people around the work
                </HeroDescription>
            </Hero>
            <div>
                <div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {projects.map((project) => (
                            <ProjectCard {...project} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
