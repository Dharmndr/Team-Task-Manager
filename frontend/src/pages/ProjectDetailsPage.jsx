import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetProjectDetailsQuery } from '../store/projectsApiSlice';
import { useGetTasksByProjectQuery, useUpdateTaskMutation, useDeleteTaskMutation } from '../store/tasksApiSlice';
import { 
  Plus, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock,
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import TaskModal from '../components/TaskModal';

const ProjectDetailsPage = () => {
  const { id: projectId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { data: project, isLoading: projectLoading } = useGetProjectDetailsQuery(projectId);
  const { data: tasks, isLoading: tasksLoading } = useGetTasksByProjectQuery(projectId);
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleStatusChange = async (task, newStatus) => {
    try {
      await updateTask({ id: task._id, status: newStatus }).unwrap();
      toast.success('Task status updated');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId).unwrap();
        toast.success('Task deleted');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  if (projectLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/30">
              Active
            </span>
          </div>
          <p className="text-slate-400 max-w-2xl leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Users size={18} className="text-slate-500" />
              <span className="font-medium">Admin: {project.admin.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Calendar size={18} className="text-slate-500" />
              <span>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {userInfo.role === 'Admin' && (
            <button 
              onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
            >
              <Plus size={20} />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map(column => (
          <div key={column} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  column === 'To Do' ? 'bg-slate-400' : 
                  column === 'In Progress' ? 'bg-blue-500' : 'bg-emerald-500'
                }`} />
                <h2 className="font-bold text-white uppercase tracking-wider text-sm">{column}</h2>
                <span className="bg-slate-800 text-slate-500 text-xs px-2 py-0.5 rounded-full border border-slate-700">
                  {tasks?.filter(t => t.status === column).length}
                </span>
              </div>
            </div>

            <div className="space-y-4 min-h-[500px]">
              {tasks?.filter(t => t.status === column).map(task => (
                <div 
                  key={task._id}
                  className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg hover:border-slate-500 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                      task.priority === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {task.priority}
                    </span>
                    {(userInfo.role === 'Admin' || userInfo._id === task.assignedTo?._id) && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(task)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                          title="Update Task"
                        >
                          <Edit size={14} />
                        </button>
                        {userInfo.role === 'Admin' && (
                          <button 
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">{task.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                  
                  {task.contribution && (
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 mb-4">
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MessageSquare size={10} />
                        Latest Update
                      </p>
                      <p className="text-xs text-slate-300 italic leading-relaxed">"{task.contribution}"</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-300 border border-slate-600">
                        {task.assignedTo?.name?.charAt(0) || '?'}
                      </div>
                      <span className="text-xs text-slate-400">{task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={12} />
                      <span className="text-[10px]">{format(new Date(task.dueDate), 'MMM d')}</span>
                    </div>
                  </div>
                  
                  {/* Status Quick Switch */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {columns.filter(c => c !== task.status).map(c => (
                      <button
                        key={c}
                        onClick={() => handleStatusChange(task, c)}
                        className="text-[10px] py-1 bg-slate-900/50 hover:bg-slate-700 text-slate-500 hover:text-white rounded-md transition-all border border-slate-700/50"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {tasks?.filter(t => t.status === column).length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-600 text-sm">
                  No tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isTaskModalOpen && (
        <TaskModal 
          isOpen={isTaskModalOpen} 
          onClose={() => setIsTaskModalOpen(false)} 
          projectId={projectId}
          task={selectedTask}
          project={project}
        />
      )}
    </div>
  );
};

export default ProjectDetailsPage;
