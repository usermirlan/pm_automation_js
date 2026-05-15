import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_URL = 'https://pm-automation-js.onrender.com';
const socket = io(API_URL);

interface Task {
  id: string;
  title: string;
  status: string;
  startedAt?: string;
  finishedAt?: string;
}

const COLUMNS = [
  { id: 'TODO', title: 'К выполнению' },
  { id: 'IN_PROGRESS', title: 'В процессе' },
  { id: 'DONE', title: 'Готово' },
];

function SortableItem(props: { task: Task, onDelete: (id: string, e: React.MouseEvent) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const calculateDuration = () => {
    if (props.task.status === 'DONE' && props.task.startedAt && props.task.finishedAt) {
      const start = new Date(props.task.startedAt).getTime();
      const end = new Date(props.task.finishedAt).getTime();
      const diff = Math.round((end - start) / 1000); // в секундах
      if (diff < 60) return `${diff} сек.`;
      return `${Math.round(diff / 60)} мин.`;
    }
    return null;
  };

  const duration = calculateDuration();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div {...attributes} {...listeners} className="text-gray-800 font-medium pr-8 cursor-grab active:cursor-grabbing flex-1">
          {props.task.title}
        </div>
        
        <button 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => props.onDelete(props.task.id, e)}
          className="absolute top-3 right-3 p-1.5 hover:bg-red-50 rounded-full text-red-400 hover:text-red-600 transition-all z-50 opacity-0 group-hover:opacity-100"
          title="Удалить задачу"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {duration && (
        <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-1 rounded flex items-center w-fit">
          <span className="mr-1">⏱</span> Затрачено: {duration}
        </div>
      )}
      {props.task.status === 'IN_PROGRESS' && (
        <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-1 rounded flex items-center w-fit animate-pulse">
           Таймер запущен...
        </div>
      )}
    </div>
  );
}

function Column({ col, tasks, onDelete }: { col: any, tasks: Task[], onDelete: (id: string, e: React.MouseEvent) => void }) {
  const { setNodeRef } = useDroppable({ id: col.id });

  return (
    <div className="flex-1 min-w-[250px] max-w-sm bg-gray-100 rounded-xl p-4 flex flex-col h-[75vh] border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700">{col.title}</h2>
        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{tasks.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto" ref={setNodeRef}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="min-h-[100px]">
            {tasks.map(task => (
               <SortableItem key={task.id} task={task} onDelete={onDelete} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    axios.get(`${API_URL}/tasks`).then(res => {
      setTasks(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Fetch error:', err);
      setLoading(false);
    });

    const socket = io(API_URL);
    socket.on('task_updated', (updatedTask: Task) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    });
    socket.on('task_created', (newTask: Task) => {
      setTasks(prev => {
        if (prev.find(t => t.id === newTask.id)) return prev;
        return [...prev, newTask];
      });
    });
    socket.on('task_deleted', (deletedTask: Task) => {
      setTasks(prev => prev.filter(t => t.id !== deletedTask.id));
    });

    return () => { socket.disconnect(); };
  }, []);

  const handleAddTask = async () => {
    const title = prompt('Введите название новой задачи:');
    if (!title) return;
    try {
      await axios.post(`${API_URL}/tasks`, { title, projectId: 'default' });
    } catch (err) {
      alert('Ошибка при создании');
    }
  };

  const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeTask = tasks.find(t => t.id === active.id);
    if (activeTask && activeTask.status !== over.id) {
      const newStatus = over.id as string;
      setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: newStatus } : t));
      try {
        await axios.patch(`${API_URL}/tasks/${active.id}`, { status: newStatus });
      } catch (error) {
        alert('Связь с сервером потеряна');
      }
    }
  };

  const autoSolvedCount = tasks.filter(t => t.title.includes('=')).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* Профессиональный Хеддер */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                JS PM Automation
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Система умного воркфлоу</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4">
              <div className="bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-600">Робот активен: {autoSolvedCount} решено</span>
              </div>
            </div>
            <button 
              onClick={handleAddTask}
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all hover:shadow-xl active:scale-95 flex items-center gap-2"
            >
              <span>+</span> Новая задача
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-8 overflow-x-auto pb-12">
              {COLUMNS.map(col => (
                <Column key={col.id} col={col} tasks={tasks.filter(t => t.status === col.id)} onDelete={handleDeleteTask} />
              ))}
            </div>
          </DndContext>
        )}
      </main>
      
      {/* Футер */}
      <footer className="fixed bottom-6 left-8 text-slate-400 text-xs font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100">
        Тема: Автоматизация процессов управления проектами (JavaScript)
      </footer>
    </div>
  );
}
