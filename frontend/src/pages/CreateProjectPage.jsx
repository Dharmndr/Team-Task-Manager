import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateProjectMutation } from '../store/projectsApiSlice';
import { useGetUsersQuery } from '../store/usersApiSlice';
import { FolderPlus, Users, AlignLeft, X, Check, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateProjectPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: users } = useGetUsersQuery();
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const toggleMember = (userId) => {
    if (members.includes(userId)) {
      setMembers(members.filter(id => id !== userId));
    } else {
      setMembers([...members, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject({ name, description, members }).unwrap();
      toast.success('Project created successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-600/20 text-blue-500 rounded-2xl">
              <FolderPlus size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create New Project</h1>
              <p className="text-slate-400">Set up a new workspace for your team</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Marketing Q4, Backend API..."
                  className="w-full px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this project about?"
                  rows="5"
                  className="w-full px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all resize-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Add Team Members</label>
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 max-h-[350px] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  {users?.filter(u => u._id !== userInfo._id).map(user => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => toggleMember(user._id)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all group ${
                        members.includes(user._id)
                          ? 'bg-blue-600/10 border-blue-500/50 text-white'
                          : 'bg-slate-800 border-transparent text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          members.includes(user._id) ? 'bg-blue-600' : 'bg-slate-700 group-hover:bg-slate-600'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-[10px] opacity-60">{user.role}</p>
                        </div>
                      </div>
                      {members.includes(user._id) ? (
                        <div className="bg-blue-600 p-1 rounded-full text-white">
                          <Check size={12} />
                        </div>
                      ) : (
                        <Plus size={16} className="text-slate-600 group-hover:text-slate-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 px-2 italic text-center">
                Selected {members.length} member{members.length !== 1 ? 's' : ''} to join this project
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 text-slate-400 hover:text-white font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transform active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating Project...' : 'Launch Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
