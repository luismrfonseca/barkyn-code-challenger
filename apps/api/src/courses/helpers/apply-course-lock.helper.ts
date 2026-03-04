import { Course, Enrollment } from '@prisma/client';

type CourseWithLockStatus = Course & {
    isLocked: boolean;
    enrollmentStatus: string | null;
};

export function applyCourseLock(
    courses: Course[],
    enrollments: Enrollment[],
): CourseWithLockStatus[] {
    const enrollmentMap = new Map(
        enrollments.map((e) => [e.courseId, e]),
    );

    return courses.map((course, index) => {
        const enrollment = enrollmentMap.get(course.id);

        const listStatus = ["COMPLETED", "ENROLLED"];
        let status = "";
        const isCurrentCompleted = enrollment?.status === 'COMPLETED';

        if (!isCurrentCompleted && enrollment?.status !== undefined) {
            status = "bloqueado";
        }
        if (enrollment?.status === "COMPLETED") {
            status = "completo";
        }
        if (enrollment?.status === "ENROLLED") {
            status = "inscrito";
        }

        // Primeiro curso está sempre desbloqueado
        if (index === 0) {
            return {
                ...course,
                isLocked: false,
                status: status,
                enrollmentStatus: enrollment?.status ?? null,
            };
        }

         // Verifica se o curso anterior foi concluído
        const previousCourse = courses[index - 1];
        const previousEnrollment = enrollmentMap.get(previousCourse.id);
        const isPreviousCompleted = previousEnrollment?.status === 'COMPLETED';

        status = "";

        if (!isPreviousCompleted) {
            status = "bloqueado";
        }
        if (previousEnrollment?.status === "COMPLETED") {
            if(enrollment?.status === "ENROLLED") {
                status = "inscrito";
            }
            if(enrollment?.status === "COMPLETED") {
                status = "completo";
            }
        }
        if (previousEnrollment?.status === "ENROLLED") {
            status = "bloqueado";
        }

        if (!isPreviousCompleted) {
            return {
                id: course.id,
                title: course.title,
                description: course.description,
                sortOrder: course.sortOrder,
                isLocked: true,
                enrollmentStatus: enrollment?.status ?? null,
                price: course.price,
                availableSlots: course.availableSlots,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
                status: status,
            };
        }

        return {
            ...course,
            isLocked: false,
            status: status,
            enrollmentStatus: enrollment?.status ?? null,
        };
    });
}
