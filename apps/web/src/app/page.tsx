"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, CourseWithStatus } from "@/types";
import { fetchUsers, fetchCourses, calculateProgressStats, completeCourse, enrollInCourse } from "@/lib/data";
import UserSwitcher from "@/components/UserSwitcher";
import ProgressBar from "@/components/ProgressBar";
import CourseCard from "@/components/CourseCard";
import toast from "react-hot-toast";
import { GraduationCap, BookOpen, Loader2, RefreshCw } from "lucide-react";

export default function Home() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 1. Fetch de Utilizadores
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await fetchUsers();
      if (data.length > 0 && !currentUser) setCurrentUser(data[0]);
      return data;
    },
  });

  // 2. Fetch de Cursos (Reage automaticamente à mudança do currentUser)
  const { 
    data: courses = [], 
    isLoading: isLoadingCourses,
    isFetching: isFetchingCourses,
    refetch: refetchCourses 
  } = useQuery({
    queryKey: ["courses", currentUser?.id],
    queryFn: () => fetchCourses(currentUser!.id),
    enabled: !!currentUser?.id, // Só executa se houver ID
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  // 3. Mutação para Ações (Enroll/Complete)
  const actionMutation = useMutation({
    mutationFn: async ({ userId, courseId, status }: { userId: string, courseId: string, status: string }) => {
      if (status === "") return await enrollInCourse(userId, courseId);
      return await completeCourse(userId, courseId);
    },
    onSuccess: (message) => {
      toast.success(message);
      // Invalida a cache para forçar refresh dos cursos e progresso
      queryClient.invalidateQueries({ queryKey: ["courses", currentUser?.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao processar ação");
    }
  });

  const progressStats = courses.length > 0 
    ? calculateProgressStats(courses)
    : { completed: 0, total: 0, percentage: 0 };

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
  };

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">A carregar utilizadores...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Escola Canina</h1>
          </div>
          <p className="text-sm text-gray-500">Plataforma E-learning</p>
        </div>

        {/* User Switcher */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
            Utilizador
          </label>
          <UserSwitcher
            users={users}
            currentUser={currentUser}
            onUserChange={handleUserChange}
          />
        </div>

        {/* Estatísticas */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-semibold text-gray-900">{courses.length}</div>
                <div className="text-gray-500">Cursos disponíveis</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <GraduationCap className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-semibold text-gray-900">{progressStats.completed}</div>
                <div className="text-gray-500">Cursos concluídos</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Bem-vindo(a), {currentUser.name}! 👋
              </h2>
              <button
                onClick={() => refetchCourses()}
                disabled={isLoadingCourses}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingCourses ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>

            {/* Progress Bar */}
            {!isLoadingCourses && courses.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <ProgressBar
                  completed={progressStats.completed}
                  total={progressStats.total}
                  percentage={progressStats.percentage}
                />
              </div>
            )}
          </div>

          {/* Courses Grid */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Cursos Disponíveis
            </h3>

            {isLoadingCourses ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-gray-600">A carregar cursos...</p>
                </div>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
                <BookOpen className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-yellow-900 mb-2">
                  Nenhum curso disponível
                </h4>
                <p className="text-yellow-700">
                  Não foram encontrados cursos para este utilizador.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    userId={currentUser.id}
                    course={course}
                    courseAction={(userId, courseId, status) => 
                        actionMutation.mutate({ userId, courseId, status })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Informação adicional */}
          {!isLoadingCourses && progressStats.completed === progressStats.total && progressStats.total > 0 && (
            <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                Parabéns!
              </h3>
              <p className="text-green-700">
                Completou todos os cursos disponíveis! Continue assim!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
