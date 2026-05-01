import { X, UserMinus, User, Mail, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRemoveMemberMutation } from '../store/projectsApiSlice';
import { toast } from 'react-hot-toast';

const MemberModal = ({ isOpen, onClose, project }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.role === 'Admin';
  const [removeMember, { isLoading }] = useRemoveMemberMutation();

  const handleRemove = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member from the project?')) {
      try {
        await removeMember({ projectId: project._id, userId }).unwrap();
        toast.success('Member removed successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white">Project Members</h2>
            <p className="text-xs text-slate-400 mt-1">{project.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            {/* Admin (Cannot be removed) */}
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                  {project.admin.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white flex items-center gap-1">
                    {project.admin.name}
                    <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30">Admin</span>
                  </p>
                  <p className="text-[11px] text-slate-500">{project.admin.email}</p>
                </div>
              </div>
            </div>

            {/* Members */}
            {project.members.map((member) => (
              <div key={member._id} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-transparent hover:border-slate-600 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-300">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{member.name}</p>
                    <p className="text-[11px] text-slate-500">{member.email}</p>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleRemove(member._id)}
                    disabled={isLoading}
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Remove Member"
                  >
                    <UserMinus size={18} />
                  </button>
                )}
              </div>
            ))}

            {project.members.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm italic">No other members in this project.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;
