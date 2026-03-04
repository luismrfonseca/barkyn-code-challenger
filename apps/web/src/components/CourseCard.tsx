"use client";

import { CourseWithStatus } from "@/types";
import { Lock, CheckCircle2, Play, Euro, User } from "lucide-react";

interface CourseCardProps {
  userId: string;
  course: CourseWithStatus;
  courseAction: (userId: string, courseId: string, status: string) => void;
}

export default function CourseCard({ userId, course, courseAction }: CourseCardProps) {
  const { status, title, description, icon, price, id, availableSlots } = course;

  const handleClick = () => {
    courseAction(userId, id, status);
  };

  return (
    <div
      className={`
        relative rounded-xl border-2 p-6 transition-all duration-300
        ${
          status === "completo"
            ? "border-green-500 bg-green-50"
            : status === ""
            ? "border-blue-500 bg-white shadow-lg hover:shadow-xl hover:-translate-y-1"
            : status === "inscrito"
            ? "border-green-500 bg-green-50"
            : "border-gray-300 bg-gray-50 opacity-60"
        }
        ${status === "bloqueado" ? "grayscale" : ""}
      `}
    >
      {/* Ícone do curso */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Euro className="w-4 h-4" />
            <span>{price}</span>
            <User className="w-4 h-4" />
            <span>{availableSlots}</span>
          </div>
        </div>
      </div>

      {/* Descrição */}
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">{description}</p>

      {/* Botão de ação */}
      <button
        onClick={handleClick}
        disabled={status === "bloqueado" || status === "completo"}
        className={`
          w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
          ${
            status === "completo"
              ? "bg-green-100 text-green-700 cursor-default"
              : status === ""
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg"
              : status === "inscrito"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
      >
        {status === "" && (
          <>
            <Lock className="w-4 h-4" />
            Inscreva-se
          </>
        )}
        {status === "bloqueado" && (
          <>
            <Lock className="w-4 h-4" />
            Bloqueado
          </>
        )}
        {status === "inscrito" && (
          <>
            <Play className="w-4 h-4" />
            Terminar Curso
          </>
        )}
        {status === "completo" && (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Completo
          </>
        )}
      </button>

    </div>
  );
}
