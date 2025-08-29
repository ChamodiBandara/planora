// TaskItem.jsx
import React from "react";
import { CheckCircle2, Clock, Calendar } from "lucide-react";

export default function TaskItem({ task, onMarkComplete }) {
  const isCompleted = task.status === "completed";

  return (
    <li
      className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
        isCompleted ? "opacity-75" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center mb-3">
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
            ) : (
              <Clock className="w-6 h-6 text-indigo-600 mr-3" />
            )}
            <p
              className={`font-medium text-xl ${
                isCompleted ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {task.title}
            </p>
          </div>

          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <p className="text-sm text-gray-600">
              Deadline: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>

          {!isCompleted && (
            <button
              onClick={() => onMarkComplete(task._id)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
