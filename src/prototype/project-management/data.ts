import { Zap as Lightning, Clock as ClockIcon } from 'lucide-react';
export const initialKanbanData = [
  {
    id: 'todo', title: 'To-Do List',
    cards: [
      { id: 'c1', tag: 'Design', tagColor: 'text-orange-500', tagBg: 'bg-orange-500', progress: 30, progressColor: 'bg-emerald-500', title: 'Create wireframe for landing page phase 1', avatars: 3, due: 'Due in 4 days' },
      { id: 'c2', tag: 'Important', tagColor: 'text-orange-500', tagBg: 'bg-orange-500', progress: 50, progressColor: 'bg-emerald-200', title: 'Visual Graphic for Presentation to Client', avatars: 4, due: 'Due in 4 days' },
      { id: 'c3', tag: 'Database', tagColor: 'text-emerald-500', tagBg: 'bg-emerald-500', progress: 40, progressColor: 'bg-emerald-500', title: 'Setup database for create API connection', avatars: 2, due: 'Due in 4 days' }
    ]
  },
  {
    id: 'progress', title: 'On Progress',
    cards: [
      { id: 'c4', tag: 'UPDATE', tagColor: 'text-emerald-500', tagBg: 'bg-emerald-500', progress: 80, progressColor: 'bg-emerald-500', title: 'Update information in footer section', avatars: 4, due: 'Due in 4 days' },
      { id: 'c5', tag: 'Video', tagColor: 'text-blue-500', tagBg: 'bg-blue-500', progress: 70, progressColor: 'bg-blue-600', title: 'Motion Graphic Video Promotion for Advertising', avatars: 3, due: 'Due in 4 days' }
    ]
  },
  {
    id: 'done', title: 'Done',
    cards: [
      { id: 'c6', tag: 'BUGS FIXING', tagColor: 'text-red-500', tagBg: 'bg-red-500', progress: 100, progressColor: 'bg-red-500', title: 'Button contact not working when clikced', avatars: 4, due: 'Due in 4 days' },
      { id: 'c7', tag: 'BUGS FIXING', tagColor: 'text-red-500', tagBg: 'bg-red-500', progress: 80, progressColor: 'bg-red-500', title: 'BUGS report from user testing [25 Points]', avatars: 4, due: 'Due In 4 days' },
      { id: 'c8', tag: 'HTML', tagColor: 'text-red-500', tagBg: 'bg-red-500', progress: 100, progressColor: 'bg-red-500', title: 'Create base html project landing page', avatars: 4, due: 'Due in 4 days' }
    ]
  },
  { id: 'revised', title: 'Revised', cards: [] }
];

export const projectDetailData = {
  title: "Workload Company Profile Websites Development",
  author: "Tommy Hank",
  date: "June 31, 2020",
  createdDate: "Monday, October 31th, 2020",
  dueDate: "Monday, October 31th, 2020",
  progress: 60,
  description1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  description2: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  subtitle: "Section 1.10.32 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC"
};

export const projectListData = [
  { id: 1, title: "Workload Company Profile Websites Development", client: "Internal", progress: 60, due: "Oct 31, 2020", status: "Active" },
  { id: 2, title: "Ombe Cafe Reservation System", client: "Ombe Cafe", progress: 85, due: "Nov 15, 2020", status: "Active" },
  { id: 3, title: "Pushup Studios Desktop App Integration", client: "Pushup Studios", progress: 30, due: "Dec 05, 2020", status: "Delayed" },
  { id: 4, title: "Kleon Team Management Portal", client: "Kleon Team", progress: 100, due: "Sep 20, 2020", status: "Completed" },
];

export const analyticsData = {
  balance: [{ name: '01', v1: 20, v2: 10 }, { name: '02', v1: 40, v2: 15 }, { name: '03', v1: 30, v2: 25 }, { name: '04', v1: 80, v2: 30 }, { name: '05', v1: 40, v2: 20 }, { name: '06', v1: 90, v2: 25 }, { name: '07', v1: 85, v2: 22 }],
  statsBar: [{ name: 'Week 01', a: 400, b: 500, c: 0 }, { name: 'Week 02', a: 200, b: 200, c: 0 }, { name: 'Week 03', a: 800, b: 300, c: 0 }, { name: 'Week 04', a: 450, b: 700, c: 0 }, { name: 'Week 05', a: 250, b: 400, c: 400 }],
  statsLine: [{ name: 'April', v1: 300, v2: 500 }, { name: 'May', v1: 450, v2: 700 }, { name: 'June', v1: 250, v2: 200 }, { name: 'July', v1: 350, v2: 200 }, { name: 'August', v1: 250, v2: 350 }, { name: 'September', v1: 300, v2: 550 }, { name: 'October', v1: 450, v2: 350 }, { name: 'November', v1: 100, v2: 100 }, { name: 'December', v1: 150, v2: 250 }],
  sparklines: {
    clients: [{v: 10}, {v: 15}, {v: 12}, {v: 25}, {v: 20}, {v: 30}],
    projects: [{v: 20}, {v: 25}, {v: 15}, {v: 35}, {v: 30}, {v: 45}]
  },
  pieCategories: [{ name: 'Web', value: 763, color: '#10B981' }, { name: 'Mobile', value: 321, color: '#8B5CF6' }, { name: 'Design', value: 69, color: '#EAB308' }, { name: 'Consultation', value: 154, color: '#EF4444' }, { name: 'Others', value: 696, color: '#3B82F6' }]
};

export const activityData = {
  today: [
    { id: 1, type: 'mention', user: 'Jackie Kun', action: 'mentioned you at Kleon Projects', time: '2m ago', date: 'Monday, June 31 2020', icon: Lightning, color: 'bg-emerald-500' },
    { id: 2, type: 'reminder', user: 'System', action: '[REMINDER] Due date of Highspeed Studios Projects te task will be coming', time: '6m ago', date: 'Monday, June 31 2020', icon: ClockIcon, color: 'bg-red-500' },
    { id: 3, type: 'create', user: 'Olivia Johanna', action: 'has created new task at Kleon Projects', time: '16m ago', date: 'Monday, June 31 2020', icon: Lightning, color: 'bg-blue-600' },
    { id: 4, type: 'comment', user: 'Jackie Kun', action: 'commented at Kleon Projects "Hei, please update the ..."', time: '4h ago', date: 'Monday, June 31 2020', icon: Lightning, color: 'bg-emerald-500' },
    { id: 5, type: 'move', user: 'You', action: 'has moved "Wireframing Landing Page" task to Done', time: '12:31 AM', date: 'Monday, June 31 2020', icon: Lightning, color: 'bg-emerald-500' },
  ],
  yesterday: [
    { id: 6, type: 'mention', user: 'Jackie Kun', action: 'mentioned you at Kleon Projects', time: 'Yesterday', date: 'Sunday, June 30 2020', icon: Lightning, color: 'bg-emerald-500' },
    { id: 7, type: 'reminder', user: 'System', action: '[REMINDER] Due date of Highspeed Studios Projects te task will be coming', time: 'Yesterday', date: 'Sunday, June 30 2020', icon: Lightning, color: 'bg-red-500' },
    { id: 8, type: 'move', user: 'You', action: 'has moved "Wireframing Landing Page" task to Done', time: 'Yesterday', date: 'Sunday, June 30 2020', icon: Lightning, color: 'bg-blue-600' },
  ]
};

