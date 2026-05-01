import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCreateTaskMutation, useUpdateTaskMutation } from '../store/tasksApiSlice';
import { useGetUsersQuery } from '../store/usersApiSlice';
import { X, Calendar, User, AlignLeft, Flag, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, projectId, task, project }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('To Do');
  const [contribution, setContribution] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const isMember = userInfo?.role === 'Member';

  const { data: users } = useGetUsersQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate.split('T')[0]);
      setPriority(task.priority);
      setAssignedTo(task.assignedTo?._id || '');
      setStatus(task.status);
      setContribution(task.contribution || '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setAssignedTo('');
      setStatus('To Do');
      setContribution('');
    }
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await updateTask({
          id: task._id,
          title,
          description,
          dueDate,
          priority,
          assignedTo,
          status,
          contribution,
        }).unwrap();
        toast.success('Task updated');
      } else {
        await createTask({
          title,
          description,
          dueDate,
          priority,
          assignedTo,
          project: projectId,
        }).unwrap();
        toast.success('Task created');
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{task ? 'Update Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isMember && task}
              className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all ${isMember && task ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isMember && task}
              rows="3"
              className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all ${isMember && task ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Add more details..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isMember && task}
                className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all ${isMember && task ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={isMember && task}
                className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all appearance-none ${isMember && task ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Assigned To</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={isMember && task}
              className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all ${isMember && task ? 'opacity-50 cursor-not-allowed' : ''}`}
              required
            >
              <option value="">Select Member</option>
              {project?.members?.map(user => (
                <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </div>

          {task && (
            <div className={`grid grid-cols-1 ${isMember ? 'md:grid-cols-2' : ''} gap-4`}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              {isMember && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                    <MessageSquare size={12} />
                    Your Update
                  </label>
                  <input
                    type="text"
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)}
                    placeholder="What did you do?"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
            >
              {isCreating || isUpdating ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
