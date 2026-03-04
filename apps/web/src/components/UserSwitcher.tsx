"use client";

import { User } from "@/types";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface UserSwitcherProps {
    users: User[];
    currentUser: User;
    onUserChange: (user: User) => void;
}

export default function UserSwitcher({
    users,
    currentUser,
    onUserChange,
}: UserSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
                <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{currentUser.name}</div>
                    <div className="text-xs text-gray-500">{currentUser.email}</div>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="py-1 max-h-60 overflow-y-auto">
                        {users.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => {
                                    onUserChange(user);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                                {currentUser.id === user.id && (
                                    <Check className="w-5 h-5 text-green-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
