import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const foundTask = savedTasks.find((t) => t.id.toString() === id);
    setTask(foundTask);
    setEditedTask(foundTask);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 text-lg">⏳ Đang tải...</p>;
  }

  if (!task) {
    return (
      <div className="text-center mt-12">
        <p className="text-red-500 text-xl font-semibold">⚠️ Không tìm thấy công việc!</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-5 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
        >
          <ArrowLeft size={18} />
          Về trang chủ
        </button>
      </div>
    );
  }

  const handleSaveEdit = () => {
    const updatedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = updatedTasks.findIndex((t) => t.id.toString() === id);

    if (taskIndex !== -1) {
      updatedTasks[taskIndex] = { ...editedTask, updatedAt: new Date().toISOString() };
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTask(updatedTasks[taskIndex]);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <h1 className="text-3xl text-gray-800 font-bold text-center my-6">Chi tiết công việc</h1>
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {isEditing ? (
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full text-lg focus:ring-2 focus:ring-blue-400"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              />
            ) : (
              task.title
            )}
          </h1>

          <div className="mt-6 space-y-5">
            <p className="text-lg">
              <strong>Mô tả:</strong>{" "}
              {isEditing ? (
                <textarea
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                />
              ) : (
                task.description
              )}
            </p>

            <p className="text-lg">
              <strong>Trạng thái:</strong>{" "}
              {isEditing ? (
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  value={editedTask.status}
                  onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                >
                  <option value="Chưa làm">Chưa làm</option>
                  <option value="Đang làm">Đang làm</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>
              ) : (
                <span
                  className={`px-4 py-2 rounded-lg text-white font-semibold ${
                    task.status === "Hoàn thành" ? "bg-green-500" : task.status === "Đang làm" ? "bg-orange-500" : "bg-red-500"
                  }`}
                >
                  {task.status}
                </span>
              )}
            </p>

            <p className="text-lg">
              <strong>Ngày tạo:</strong>{" "}
              {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Không xác định"}
            </p>

            <p className="text-lg">
              <strong>Hạn chót:</strong>{" "}
              {isEditing ? (
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  value={editedTask.dueDate || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                />
              ) : (
                task.dueDate || "Chưa đặt"
              )}
            </p>
          </div>

          <div className="flex gap-4 mt-8 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-3 flex items-center gap-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all"
            >
              <ArrowLeft size={20} />
              Quay lại
            </button>

            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-3 flex items-center gap-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
                >
                  <Save size={20} />
                  Lưu
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-3 flex items-center gap-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
                >
                  <X size={20} />
                  Hủy
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-3 flex items-center gap-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
              >
                ✏️ Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;