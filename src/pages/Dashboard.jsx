import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { useLocation, useNavigate } from 'react-router-dom';


function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const[filteredTasks, setFilteredTasks] = useState([]);
  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);
    
    // Cập nhật URL
    const params = new URLSearchParams(location.search);
    params.set('filter', value);
    navigate(`?${params.toString()}`);
  };
  
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    
    // Cập nhật URL
    const params = new URLSearchParams(location.search);
    params.set('search', value);
    navigate(`?${params.toString()}`);
  };
  
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState({
    title: '', description: [], status: 'Chưa làm', createdAt: '', dueDate: '', updatedAt: ''
  });
  const [editingTaskId, setEditingTaskId] = useState(null);

  
  const [filter, setFilter] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
const navigate = useNavigate();

// Lấy giá trị filter và search từ URL khi trang tải
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const filterParam = params.get('filter');
  const searchParam = params.get('search');
  
  if (filterParam) setFilter(filterParam);
  if (searchParam) setSearchQuery(searchParam);
}, [location.search]);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSaveTask = () => {
    if (newTask.title && newTask.description) {
      const now = new Date().toISOString();
  
      if (editingTaskId) {
        // Cập nhật công việc hiện tại
        const updatedTasks = tasks.map(task =>
          task.id === editingTaskId
            ? { ...newTask, updatedAt: now }
            : task
        );
        setTasks(updatedTasks);
        setEditingTaskId(null); // Xóa trạng thái sửa
      } else {
        // Thêm công việc mới
        const updatedTasks = [...tasks, { ...newTask, id: Date.now(), createdAt: now, updatedAt: now }];
        setTasks(updatedTasks);
      }
  
      setNewTask({ title: '', description: '', status: 'Chưa làm', createdAt: '', dueDate: '', updatedAt: '' });
    }
  };
  

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setNewTask({ ...taskToEdit });
      setEditingTaskId(id); // Đánh dấu công việc đang sửa
    }
  };

  const handleCompleteTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: 'Hoàn thành', updatedAt: new Date().toISOString() } : task));
  };

  const handleDeleteTask = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa công việc này?");
    if (confirmDelete) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };
  

  useEffect(() => {
    setFilteredTasks(tasks.filter(task =>
      (filter === 'Tất cả' || task.status === filter) &&
      (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ));
  }, [tasks, filter, searchQuery]);
  
  

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Danh Sách Công Việc</h1>
              <button onClick={handleThemeToggle} className="text-gray-800 dark:text-gray-100 p-2 rounded-full">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
            <div className="mb-8">
              <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Tiêu đề công việc" className="px-4 py-2 border border-gray-300 rounded-md w-full mb-2" />
              <input type="text" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Nhập mô tả hoặc dán link ảnh..." className="px-4 py-2 border border-gray-300 rounded-md w-full mb-2"
/>              <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-md w-full mb-2" />
              <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-md w-full mb-2">
                <option value="Chưa làm">Chưa làm</option>
                <option value="Đang làm">Đang làm</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
              <button onClick={handleSaveTask} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"> {editingTaskId ? 'Cập nhật công việc' : 'Thêm công việc'} </button>
            </div>
            <div className="mb-4">
  <input
    type="text"
    placeholder="Tìm kiếm công việc..."
    value={searchQuery}
    onChange={handleSearchChange}
    className="px-4 py-2 border border-gray-300 rounded-md w-full mb-2"
  />
  
  <select onChange={handleFilterChange} value={filter} className="px-4 py-2 border border-gray-300 rounded-md w-50 mb-2">     
    <option value="Tất cả">Tất cả</option>
    <option value="Chưa làm">Chưa làm</option>
    <option value="Đang làm">Đang làm</option>
    <option value="Hoàn thành">Hoàn thành</option>
  </select>      
</div>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-700">
                    <th className="px-6 py-3">Tiêu đề</th>
                    <th className="px-6 py-3">Mô tả</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3">Ngày tạo</th>
                    <th className="px-6 py-3">Hạn chót</th>
                    <th className="px-6 py-3">Cập nhật gần nhất</th>
                    <th className="px-6 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4"><Link to={`/task/${task.id}`} className="text-blue-500 underline">{task.title}</Link></td>
                      <td className="px-6 py-4"> {task.description.startsWith("http") ? ( <img src={task.description} alt="Hình ảnh công việc" className="w-20 h-20 object-cover rounded-md" /> ) : ( task.description )}</td>                      <td className={`px-6 py-4 font-semibold ${task.status === 'Hoàn thành' ? 'text-green-500' : task.status === 'Đang làm' ? 'text-yellow-500' : 'text-red-500'}`}>{task.status}</td>
                      <td className="px-6 py-4">{new Date(task.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{task.dueDate || 'Chưa đặt'}</td>
                      <td className="px-6 py-4">{new Date(task.updatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleEditTask(task.id)} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">Sửa</button>
                        <button onClick={() => handleCompleteTask(task.id)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 ml-2">Hoàn thành</button>
                        <button onClick={() => handleDeleteTask(task.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;