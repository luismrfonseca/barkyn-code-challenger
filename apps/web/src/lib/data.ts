import { User, CourseWithStatus } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    const users = await response.json();
    
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Fetch courses from API with user ID in header
export async function fetchCourses(userId: string): Promise<CourseWithStatus[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      headers: {
        'x-user-id': userId
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    
    const courses = await response.json();
    
    return courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      sortOrder: course.sortOrder,
      icon: "📚",
      availableSlots: course.availableSlots || 0,
      price: course.price || "N/A",
      status: course.status,
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function enrollInCourse(userId: string, courseId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({ userId, courseId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.message;
    }

    const result = await response.json();
    return result.message;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw error;
  }
}

export async function completeCourse(userId: string, courseId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({ userId, courseId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.message;
    }

    const result = await response.json();
    return result.message;
  } catch (error) {
    console.error("Error completing course:", error);
    throw error;
  }
}

export function calculateProgressStats(courses: CourseWithStatus[]) {
  const completedCount = courses.filter(c => c.status === "completo").length;
  const totalCourses = courses.length;
  const percentage = Math.round((completedCount / totalCourses) * 100);

  return {
    completed: completedCount,
    total: totalCourses,
    percentage,
  };
}
