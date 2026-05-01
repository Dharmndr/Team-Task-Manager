import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetDashboardStatsQuery } from '../store/tasksApiSlice';
import { useGetProjectsQuery } from '../store/projectsApiSlice';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Folder, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import MemberModal from '../components/MemberModal';

const DashboardPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: projects, isLoading: projectsLoading } = useGetProjectsQuery();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const openMemberModal = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProject(project);
    setIsMemberModalOpen(true);
  };

  if (statsLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Tasks', 
      value: stats?.totalTasks || 0, 
      icon: CheckCircle2, 
      color: 'bg-blue-500/10 text-blue-500' 
    },
    { 
      label: 'Overdue', 
      value: stats?.overdueTasks || 0, 
      icon: AlertCircle, 
      color: 'bg-red-500/10 text-red-500' 
    },
    { 
      label: 'Active Projects', 
      value: projects?.length || 0, 
      icon: Folder, 
      color: 'bg-emerald-500/10 text-emerald-500' 
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {userInfo.name}!</p>
        </div>
        {userInfo.role === 'Admin' && (
          <Link
            to="/projects/new"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus size={20} />
            <span>Create Project</span>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects List */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Folder className="text-blue-500" />
              Your Projects
            </h2>
            <Link to="/projects" className="text-sm text-blue-500 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-slate-700">
            {projects?.slice(0, 5).map((project) => (
              <Link 
                key={project._id} 
                to={`/projects/${project._id}`}
                className="p-6 flex items-center justify-between hover:bg-slate-700/50 transition-colors group"
              >
                <div className="space-y-1">
                  <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h4>
                  <p className="text-sm text-slate-400 line-clamp-1">{project.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={(e) => openMemberModal(e, project)}
                      className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                    >
                      <Users size={12} />
                      {project.members.length + 1} members
                    </button>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      Created {format(new Date(project.createdAt), 'MMM d')}
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-slate-600 group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}
            {projects?.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                No projects found. Create one to get started!
              </div>
            )}
          </div>
        </div>

        {/* Tasks Status Breakdown */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" />
            Task Distribution
          </h2>
          <div className="space-y-6">
            {stats?.tasksByStatus.map((status) => (
              <div key={status._id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">{status._id}</span>
                  <span className="text-slate-400">{status.count} tasks</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      status._id === 'Done' ? 'bg-emerald-500' : 
                      status._id === 'In Progress' ? 'bg-blue-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${(status.count / stats.totalTasks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {(!stats?.tasksByStatus || stats.tasksByStatus.length === 0) && (
              <div className="p-12 text-center text-slate-500">
                No tasks available for distribution.
              </div>
            )}
          </div>
        </div>
      </div>
      <MemberModal 
        isOpen={isMemberModalOpen} 
        onClose={() => setIsMemberModalOpen(false)} 
        project={selectedProject} 
      />
    </div>
  );
};

export default DashboardPage;
