const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resources = [
    {
        title: "2024 DE&I Global Benchmark Report",
        description: "A comprehensive analysis of diversity, equity, and inclusion trends across major industries and regions.",
        type: "Research",
        category: "Research",
        content: "This report outlines the current state of global DE&I efforts, highlighting key success factors and areas for improvement.",
        tags: ["DE&I", "Benchmark", "2024", "Analytics"],
        views: 1250,
        downloads: 450,
        isPublished: true,
        authorId: "cmmj0lggk0000oh7c4fjhnfdu"
    },
    {
        title: "Inclusive Leadership Toolkit",
        description: "Practical strategies and exercises for managers to foster a more inclusive and high-performing team environment.",
        type: "Toolkit",
        category: "Leadership",
        content: "Includes modules on unconscious bias, active listening, and equitable performance management.",
        tags: ["Leadership", "Management", "Toolkit", "Inclusion"],
        views: 3200,
        downloads: 1200,
        isPublished: true,
        authorId: "cmmj0lggk0000oh7c4fjhnfdu"
    },
    {
        title: "Web Accessibility (WCAG 2.2) Quick Guide",
        description: "A distilled checklist of accessibility requirements for developers and designers to ensure digital inclusivity.",
        type: "Guide",
        category: "Technology",
        content: "Covers the essential principles: Perceivable, Operable, Understandable, and Robust.",
        tags: ["Accessibility", "Web", "Design", "Dev"],
        views: 1800,
        downloads: 600,
        isPublished: true,
        authorId: "cmmj0lggk0000oh7c4fjhnfdu"
    },
    {
        title: "Neurodiversity in the Workplace Guide",
        description: "Best practices for supporting neurodivergent employees, including workspace adjustments and communication styles.",
        type: "Guide",
        category: "HR",
        content: "Learn how to embrace different cognitive styles to drive innovation and employee well-being.",
        tags: ["Neurodiversity", "HR", "Inclusion", "Best Practices"],
        views: 2100,
        downloads: 300,
        isPublished: true,
        authorId: "cmmj0lggk0000oh7c4fjhnfdu"
    },
    {
        title: "Supplier Diversity Program Framework",
        description: "A step-by-step roadmap for organizations to build and scale a successful supplier diversity program.",
        type: "Framework",
        category: "Business",
        content: "Strategic guidance on sourcing, certification, and impact measurement.",
        tags: ["Sourcing", "Business", "Diversity", "Strategy"],
        views: 950,
        downloads: 200,
        isPublished: true,
        authorId: "cmmj0lggk0000oh7c4fjhnfd"
    }
];

async function seed() {
    console.log('🌱 Seeding community resources...');
    for (const resource of resources) {
        await prisma.resource.create({
            data: resource
        });
    }
    console.log('✅ Successfully seeded resources!');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
