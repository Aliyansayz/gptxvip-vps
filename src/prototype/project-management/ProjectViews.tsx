
import { LayoutDashboard, Users, MessageSquare, Clock, Info, MoreVertical, ChevronDown, UserPlus, Smile, Paperclip, Send, ThumbsUp, Reply, Star, Plus, ChevronRight } from 'lucide-react';

import { projectListData, projectDetailData } from './data';

export function ProjectListView({ onSelect }: { onSelect: (project: typeof projectListData[number]) => void }) {
  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">All Projects</h2>
          <p className="text-sm font-medium text-slate-500">Manage and track your active projects</p>
        </div>
        <button className="bg-emerald-500 text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-emerald-600 shadow-sm transition-colors">
          <Plus size={14} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {projectListData.map(project => (
           <div 
             key={project.id} 
             onClick={() => onSelect(project)}
             className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-500/30 transition-all cursor-pointer group"
           >
             <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                 <LayoutDashboard size={20} />
               </div>
               <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : project.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                 {project.status}
               </span>
             </div>
             
             <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 h-12">{project.title}</h3>
             <p className="text-xs font-medium text-slate-400 mb-6 flex items-center gap-1"><Users size={12}/> {project.client}</p>
             
             <div className="mb-4">
               <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-2">
                 <span>Progress</span>
                 <span>{project.progress}%</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className={`h-full rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{width: `${project.progress}%`}}></div>
               </div>
             </div>
             
             <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-semibold text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12}/> Due {project.due}</span>
                <span className="flex items-center gap-1 text-emerald-500 font-bold group-hover:translate-x-1 transition-transform">Details <ChevronRight size={12}/></span>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

export function ProjectDetailsView({ project }: { project: typeof projectListData[number] }) {
  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      <div className="w-full h-48 md:h-64 bg-slate-200/80 rounded-[2rem] mb-8 shadow-sm border border-slate-200/50"></div>
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
            {project.title}
          </h2>
          <p className="text-[13px] font-medium text-slate-400">
            Created by {projectDetailData.author} on {projectDetailData.date}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 pt-1">
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold">
            <Info size={16} /> Project Details
          </button>
          <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex flex-wrap items-center gap-3">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors shadow-sm">
            New <ChevronDown size={14} />
          </button>
          <button className="bg-emerald-100/50 hover:bg-emerald-100 text-emerald-700 px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors">
            <UserPlus size={14} /> Invite People
          </button>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-sm">Edit</button>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-sm">Private</button>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-sm flex items-center gap-2">
            <MessageSquare size={14} className="text-emerald-500" /> 45 Comments
          </button>
        </div>
        <div className="flex items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#F8FAFC] bg-slate-300 ${i !== 0 ? '-ml-2' : ''}`}></div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-[#F8FAFC] bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold -ml-2 z-10 shadow-sm">
            5+
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         <div>
           <div className="flex items-center gap-2 text-emerald-500 mb-2">
             <Clock size={16} /> <h4 className="text-sm font-bold text-slate-900">Project Create</h4>
           </div>
           <p className="text-xs font-medium text-slate-400 ml-6">{projectDetailData.createdDate}</p>
         </div>
         <div>
           <div className="flex items-center gap-2 text-emerald-500 mb-2">
             <Clock size={16} /> <h4 className="text-sm font-bold text-slate-900">Due date</h4>
           </div>
           <p className="text-xs font-medium text-slate-400 ml-6">{projectDetailData.dueDate}</p>
         </div>
         <div className="md:col-span-1">
           <h4 className="text-sm font-bold text-slate-900 mb-3">Total Progress {project.progress}%</h4>
           <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 rounded-full" style={{width: `${project.progress}%`}}></div>
           </div>
         </div>
      </div>

      <div className="mb-12 max-w-4xl">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Project Description</h4>
        <div className="prose prose-sm md:prose-base text-slate-600 font-medium leading-relaxed">
          <p className="mb-6">"{projectDetailData.description1}"</p>
          <h5 className="text-slate-900 font-bold mb-4">{projectDetailData.subtitle}</h5>
          <p>"{projectDetailData.description2}"</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-10 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <textarea 
            placeholder="Type comment here..."
            className="w-full bg-transparent resize-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 min-h-[60px]"
          ></textarea>
          <div className="flex justify-end items-center gap-4 mt-2">
            <button className="text-slate-400 hover:text-emerald-500 transition-colors"><Smile size={18} /></button>
            <button className="text-slate-400 hover:text-emerald-500 transition-colors"><Paperclip size={18} /></button>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors shadow-sm">
              <Send size={14} className="-ml-1" /> SEND
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comment</h4>
            <button className="bg-emerald-100/50 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-emerald-100 transition-colors">
              Newest Comment <ChevronDown size={14} />
            </button>
          </div>
          
          <div className="space-y-8">
            <CommentItem name="Kevin Sirait" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod" />
            <CommentItem name="Hendric Suneo" text="Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima ve" />
            
            <div className="ml-12 space-y-8 border-l-2 border-slate-100 pl-8">
              <CommentItem name="Kesha Jean" text="m quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima ve" rating={2} />
              <CommentItem name="Lolita Humble" text="voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ name, text, rating = 0 }) {
  return (
    <div className="flex gap-4 group">
      <div className="w-10 h-10 rounded-full bg-slate-300 shrink-0"></div>
      <div className="flex-1">
        <h5 className="text-sm font-bold text-slate-900 mb-1">{name}</h5>
        <p className="text-xs text-slate-600 font-medium leading-relaxed mb-3">{text}</p>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-emerald-500 transition-colors">
            <ThumbsUp size={14} /> 45 Like
          </button>
          <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-blue-500 transition-colors">
            <Reply size={14} /> Reply
          </button>
          {rating && (
            <div className="flex gap-1 ml-auto">
              {[...Array(rating)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

