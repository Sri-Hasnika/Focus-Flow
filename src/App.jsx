import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaCheck, FaStar, FaMagic, FaCalendar, FaTags, FaBell } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { format, isPast, isToday } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Important'];

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    // Check for due tasks
    const checkReminders = () => {
      todos.forEach(todo => {
        if (todo.reminder && todo.dueDate && !todo.reminded && !todo.completed) {
          const now = new Date();
          const dueTime = new Date(todo.dueDate);
          if (isToday(dueTime) && now.getHours() >= dueTime.getHours()) {
            new Notification("Todo Reminder", {
              body: `Task due: ${todo.text}`,
              icon: "✨"
            });
            setTodos(prev => prev.map(t => 
              t.id === todo.id ? { ...t, reminded: true } : t
            ));
          }
        }
      });
    };

    if (Notification.permission === "granted") {
      const interval = setInterval(checkReminders, 60000); // Check every minute
      return () => clearInterval(interval);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: inputValue,
        completed: false,
        dueDate,
        category: selectedCategory,
        reminder,
        reminded: false
      }
    ]);
    setInputValue('');
    setDueDate(null);
    setSelectedCategory('');
    setReminder(false);
    setShowAddForm(false);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: 'bg-blue-500',
      Personal: 'bg-green-500',
      Shopping: 'bg-yellow-500',
      Health: 'bg-red-500',
      Important: 'bg-purple-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          className="absolute top-[-50px] right-[-30px] text-white/20 text-8xl floating"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaStar />
        </motion.div>

        <motion.h1 
          className="text-4xl font-bold text-center text-white mb-2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          ✨ Todo Magic ✨
        </motion.h1>

        <motion.p
          className="text-center text-white/80 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Make your tasks disappear, one check at a time!
        </motion.p>

        {!showAddForm ? (
          <motion.button
          onClick={() => setShowAddForm(true)}
          className="w-full px-6 py-3 bg-white/20 text-white rounded-2xl hover:bg-white/30 transition-colors flex items-center justify-center gap-2 mb-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaMagic className="text-lg" />
          Add New Task
        </motion.button>
        
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            className="mb-8 glass-effect p-4 rounded-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="✨ Add a magical todo..."
              className="w-full px-4 py-3 rounded-xl todo-input focus:outline-none focus:ring-2 focus:ring-white/50 mb-4"
            />
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-white/80 text-sm mb-2">Due Date</label>
                <DatePicker
                  selected={dueDate}
                  onChange={date => setDueDate(date)}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full px-4 py-2 rounded-xl todo-input focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholderText="Select due date"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-white/80 text-sm mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <motion.button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category 
                        ? `${getCategoryColor(category)} text-white` 
                        : 'bg-white/20 text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center mb-4">
              <label className="flex items-center text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminder}
                  onChange={(e) => setReminder(e.target.checked)}
                  className="mr-2"
                />
                Enable Reminder
              </label>
            </div>

            <div className="flex gap-2">
              <motion.button
                type="submit"
                className="flex-1 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaMagic className="text-lg" />
                Add Task
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}

        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100, rotate: -5 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0 }}
              className="glass-effect rounded-2xl p-4 mb-4 group todo-container"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      todo.completed ? 'bg-white border-white' : 'border-white/50 hover:border-white'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    {todo.completed && <FaCheck className="text-purple-500 text-sm" />}
                  </motion.button>
                  <span className={`text-white transition-all duration-300 ${
                    todo.completed ? 'line-through opacity-50' : ''
                  }`}>
                    {todo.text}
                  </span>
                </div>
                <motion.button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  whileHover={{ scale: 1.2, rotate: 180 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <FaTrash />
                </motion.button>
              </div>
              
              <div className="flex gap-2 ml-9">
                {todo.category && (
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(todo.category)} text-white`}>
                    {todo.category}
                  </span>
                )}
                {todo.dueDate && (
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    isPast(new Date(todo.dueDate)) && !todo.completed 
                      ? 'bg-red-500' 
                      : 'bg-white/20'
                  } text-white`}>
                    <FaCalendar className="text-xs" />
                    {format(new Date(todo.dueDate), 'MMM d, h:mm a')}
                  </span>
                )}
                {todo.reminder && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white flex items-center gap-1">
                    <FaBell className="text-xs" />
                    Reminder
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/70 p-8 glass-effect rounded-2xl"
          >
            <FaMagic className="text-4xl mx-auto mb-4 floating" />
            <p className="text-lg">Your magical todo list awaits!</p>
            <p className="text-sm opacity-75">Add your first enchanted task above ✨</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;