import {
   useState,
   useRef,
   useEffect,
   useImperativeHandle,
   forwardRef,
} from 'react'
import TaskSuggestions from './TaskSuggestions'
// import { FaStickyNote } from 'react-icons/fa'
import { useAppTheme } from '../contexts/AppThemeContext'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo, updateTodo } from '../store/TodoSlice.js'
import { motion } from 'framer-motion'

const TodoForm = forwardRef(({ editingTodo = null, onCancelEdit }, ref) => {
   const inputRef = useRef(null)
   // Expose focus method to parent
   useImperativeHandle(ref, () => ({
      focusInput: () => {
         // console.log('Trying to focus:', inputRef.current)
         inputRef.current?.focus()
      },
   }))

   // function TodoForm({ editingTodo = null, onCancelEdit }) {
   const [todo, setTodo] = useState('')
   const [dueDate, setDueDate] = useState('')
   const [priority, setPriority] = useState('medium')
   const [category, setCategory] = useState('personal')
   const [showSuggestions, setShowSuggestions] = useState(false)
   const [isRecurring, setIsRecurring] = useState(false)
   const [recurringInterval, setRecurringInterval] = useState('daily')
   const [subtasks, setSubtasks] = useState([])
   const [newSubtask, setNewSubtask] = useState('')
   const [showSubtaskInput, setShowSubtaskInput] = useState(false)
   const [note, setNote] = useState('')
   const [showNoteInput, setShowNoteInput] = useState(false)
   const wrapperRef = useRef(null)
   const dispatch = useDispatch()
   const todos = useSelector((state) => state.todos.todos)
   const { appTheme, getColorClass } = useAppTheme()

   // Load editing todo data
   useEffect(() => {
      if (editingTodo) {
         setTodo(editingTodo.todo)
         setDueDate(editingTodo.dueDate || '')
         setPriority(editingTodo.priority)
         setCategory(editingTodo.category)
         setIsRecurring(editingTodo.isRecurring || false)
         setRecurringInterval(editingTodo.recurringInterval || 'daily')
         setSubtasks(editingTodo.subtasks?.map((st) => ({ ...st })) || [])
         setNote(editingTodo.note || '')
      }
   }, [editingTodo])

   // Handle click outside for edit mode
   useEffect(() => {
      const handleClickOutside = (e) => {
         if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            // Only close if clicking outside the entire form
            const form = wrapperRef.current.closest('form')
            if (form && !form.contains(e.target)) {
               if (editingTodo) {
                  onCancelEdit()
               }
            }
         }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [editingTodo, onCancelEdit])

   const handleSubmit = (e) => {
      e.preventDefault()
      if (!todo) return toast.error('Cannot save empty Task!')

      const todoData = {
         todo,
         completed: editingTodo ? editingTodo.completed : false,
         dueDate: dueDate || null,
         priority,
         category,
         createdAt: editingTodo
            ? editingTodo.createdAt
            : new Date().toISOString(),
         isRecurring,
         recurringInterval: isRecurring ? recurringInterval : null,
         stage: editingTodo ? editingTodo.stage : 'notStarted',
         subtasks: subtasks.map((subtask) => ({
            id: subtask.id || Date.now() + Math.random(),
            text: subtask.text,
            completed: subtask.completed || false,
            createdAt: subtask.createdAt || new Date().toISOString(),
         })),
         note: note || null,
      }

      if (editingTodo) {
         dispatch(
            updateTodo({
               id: editingTodo.id,
               updatedTodo: { ...todoData },
            })
         )
         onCancelEdit()
      } else {
         dispatch(addTodo(todoData))
      }
      resetForm()
   }

   const resetForm = () => {
      setTodo('')
      setDueDate('')
      setPriority('medium')
      setCategory('personal')
      setIsRecurring(false)
      setRecurringInterval('daily')
      setSubtasks([])
      setNewSubtask('')
      setShowSubtaskInput(false)
      setNote('')
      setShowNoteInput(false)
      setShowSuggestions(false)
   }

   const handleInputChange = (e) => {
      setTodo(e.target.value)
      if (!editingTodo) {
         setShowSuggestions(true)
      }
   }

   const handleSuggestionSelect = (suggestion) => {
      setTodo(suggestion)
      setShowSuggestions(false)
   }

   const handleAddSubtask = (e) => {
      e.preventDefault()
      if (newSubtask.trim()) {
         setSubtasks([
            ...subtasks,
            {
               id: Date.now() + Math.random(),
               text: newSubtask.trim(),
               completed: false,
               createdAt: new Date().toISOString(),
            },
         ])
         setNewSubtask('')
         setShowSubtaskInput(false)
      }
   }

   const handleSubtaskChange = (index, value) => {
      const newSubtasks = [...subtasks]
      newSubtasks[index].text = value
      setSubtasks(newSubtasks)
   }

   const removeSubtask = (index) => {
      setSubtasks(subtasks.filter((_, i) => i !== index))
   }

   const isOverdue =
      editingTodo?.dueDate &&
      new Date(editingTodo.dueDate).setHours(0, 0, 0, 0) <
         new Date().setHours(0, 0, 0, 0) &&
      !editingTodo.completed

   return (
      <form onSubmit={handleSubmit} className='sm:space-y-5 space-y-3'>
         {/* Main Task Input Row */}

         <div className='lg:flex hidden flex-wrap gap-3 items-center'>
            <div
               className='relative flex-1 min-w-[200px] max-w-xl'
               ref={wrapperRef}
            >
               <input
                  type='text'
                  placeholder='What needs to be done?'
                  // ref={inputRef}
                  value={todo}
                  onChange={handleInputChange}
                  onFocus={() => !editingTodo && setShowSuggestions(true)}
                  className={`inter w-full px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 
                     ${getColorClass(appTheme.colorTheme, 'ring')}
                   transition-all duration-300 filter-glow`}
               />
               {showSuggestions && !editingTodo && (
                  <TaskSuggestions
                     input={todo}
                     onSelect={handleSuggestionSelect}
                     todos={todos}
                  />
               )}
            </div>

            {/* //? Bigger screen view  */}
            {appTheme.taskInterface.features.priority && (
               <>
                  <select
                     value={priority}
                     onChange={(e) => setPriority(e.target.value)}
                     className={`space-grotesk sm:px-3 sm:py-2 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${getColorClass(
                        appTheme.colorTheme,
                        'ring'
                     )} transition-all duration-300 text-sm sm:text-base`}
                     title='Priority'
                  >
                     <option value='low'>Low priority</option>
                     <option value='medium'>Medium priority</option>
                     <option value='high'>High priority</option>
                  </select>
               </>
            )}

            {appTheme.taskInterface.features.category && (
               <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={` space-grotesk sm:px-3 sm:py-2 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${getColorClass(
                     appTheme.colorTheme,
                     'ring'
                  )} transition-all duration-300 text-sm sm:text-base`}
                  title='Category'
               >
                  <option value='personal'>Personal</option>
                  <option value='work'>Work</option>
                  <option value='shopping'>Shopping</option>
                  <option value='other'>Other</option>
               </select>
            )}

            {appTheme.taskInterface.features.dueDate && (
               <div className='relative'>
                  <input
                     type='date'
                     value={dueDate}
                     min={new Date().toISOString().split('T')[0]}
                     onChange={(e) => setDueDate(e.target.value)}
                     className={`space-grotesk sm:px-3 sm:py-2 px-2 py-1 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${getColorClass(
                        appTheme.colorTheme,
                        'ring'
                     )} transition-all duration-300 text-sm sm:text-base ${
                        isOverdue
                           ? 'border-red-300 dark:border-red-500'
                           : 'border-gray-200 dark:border-gray-700'
                     }`}
                  />
                  {isOverdue && (
                     <div className='space-grotesk absolute -top-2 right-0 px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-md'>
                        Overdue
                     </div>
                  )}
               </div>
            )}
         </div>

         {/* //? Mobile View  */}

         <div className={`lg:hidden flex flex-wrap gap-3 items-center`}>
            <div
               className='relative flex-1 min-w-[250px] max-w-2xl'
               ref={wrapperRef}
            >
               <input
                  type='text'
                  placeholder='What needs to be done?'
                  ref={inputRef}
                  value={todo}
                  onChange={handleInputChange}
                  onFocus={() => !editingTodo && setShowSuggestions(true)}
                  className={`inter w-full px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 
                     ${getColorClass(appTheme.colorTheme, 'ring')}
                   transition-all duration-300 filter-glow mb-1.5`}
               />
               {showSuggestions && !editingTodo && (
                  <TaskSuggestions
                     input={todo}
                     onSelect={handleSuggestionSelect}
                     todos={todos}
                  />
               )}
            </div>
            {appTheme.taskInterface.features.priority && (
               <>
                  <fieldset className='fieldset pb-2'>
                     <legend className='fieldset-legend text-gray-500 dark:text-gray-400 text-xs pl-1'>
                        Priority
                     </legend>
                     <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className={`space-grotesk px-1.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${getColorClass(
                           appTheme.colorTheme,
                           'ring'
                        )} transition-all duration-300 text-sm `}
                        title='Priority'
                     >
                        <option value='low'>Low</option>
                        <option value='medium'>Medium</option>
                        <option value='high'>High</option>
                     </select>
                  </fieldset>
               </>
            )}

            {appTheme.taskInterface.features.category && (
               <fieldset className='fieldset pb-2'>
                  <legend className='fieldset-legend text-gray-500 dark:text-gray-400 text-xs pl-1'>
                     Category
                  </legend>
                  <select
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                     className={`space-grotesk px-1.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${getColorClass(
                        appTheme.colorTheme,
                        'ring'
                     )} transition-all duration-300 text-sm `}
                     title='Category'
                  >
                     <option value='personal'>Personal</option>
                     <option value='work'>Work</option>
                     <option value='shopping'>Shopping</option>
                     <option value='other'>Other</option>
                  </select>
               </fieldset>
            )}

            {appTheme.taskInterface.features.dueDate && (
               <div className='relative'>
                  <fieldset className='fieldset pb-2'>
                     <legend className='fieldset-legend text-gray-500 dark:text-gray-400 text-xs pl-1'>
                        DueDate
                     </legend>
                     <input
                        type='date'
                        value={dueDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={`space-grotesk last:px-1.5 py-1 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${getColorClass(
                           appTheme.colorTheme,
                           'ring'
                        )} transition-all duration-300 text-sm  ${
                           isOverdue
                              ? 'border-red-300 dark:border-red-500'
                              : 'border-gray-200 dark:border-gray-700'
                        }`}
                     />
                  </fieldset>
                  {isOverdue && (
                     <div className='space-grotesk absolute -top-2 right-0 px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-md'>
                        Overdue
                     </div>
                  )}
               </div>
            )}
         </div>

         {/* Additional Options Row */}

         <div className='flex flex-wrap items-center gap-3'>
            {appTheme.taskInterface.features.subtasks && (
               <>
                  {showSubtaskInput ? (
                     <div className='flex gap-2 flex-1'>
                        <input
                           type='text'
                           value={newSubtask}
                           onChange={(e) => setNewSubtask(e.target.value)}
                           placeholder='Enter subtask...'
                           className={`inter w-48 sm:w-48 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${getColorClass(
                              appTheme.colorTheme,
                              'ring'
                           )}`}
                        />
                        <motion.button
                           whileTap={{ scale: 0.97, opacity: 0.95 }}
                           transition={{ duration: 0.15, ease: 'easeInOut' }}
                           type='button'
                           onClick={handleAddSubtask}
                           className={`space-grotesk sm:px-3 sm:py-1.5 px-2 py-1 rounded-lg text-sm text-black dark:text-white font-medium ${getColorClass(
                              appTheme.colorTheme
                           )}
                        ${getColorClass(appTheme.colorTheme, 'ring')} `}
                        >
                           Add
                        </motion.button>
                        <motion.button
                           whileTap={{ scale: 0.97, opacity: 0.95 }}
                           transition={{ duration: 0.15, ease: 'easeInOut' }}
                           type='button'
                           onClick={() => setShowSubtaskInput(false)}
                           className='space-grotesk px-3 py-1.5 rounded-lg text-sm font-medium text-black dark:text-white border-gray-700 border hover:bg-gray-700'
                        >
                           Cancel
                        </motion.button>
                     </div>
                  ) : (
                     <motion.button
                        whileTap={{ scale: 0.97, opacity: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeInOut' }}
                        type='button'
                        onClick={() => setShowSubtaskInput(true)}
                        className='space-grotesk sm:px-3 sm:py-1.5 px-2 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200'
                     >
                        Add Subtask
                     </motion.button>
                  )}
               </>
            )}

            {appTheme.taskInterface.features.notes && (
               <motion.button
                  whileTap={{ scale: 0.97, opacity: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeInOut' }}
                  type='button'
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className='space-grotesk sm:px-3 sm:py-1.5 px-2 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200'
               >
                  {showNoteInput ? 'Hide Note' : 'Add Note'}
               </motion.button>
            )}

            {/* <div className='flex items-center gap-2'>
               <input
                  type='checkbox'
                  id='recurring'
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className='inter rounded border-gray-300 text-purple-500 focus:ring-purple-500'
               />
               <label
                  htmlFor='recurring'
                  className='space-grotesk text-sm text-gray-600 dark:text-gray-400'
               >
                  Recurring
               </label>
            </div>

            {isRecurring && (
               <select
                  value={recurringInterval}
                  onChange={(e) => setRecurringInterval(e.target.value)}
                  className={`space-grotesk px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${getColorClass(
                     appTheme.colorTheme,
                     'ring'
                  )} transition-all duration-300`}
               >
                  <option value='daily'>Daily</option>
                  <option value='weekly'>Weekly</option>
                  <option value='monthly'>Monthly</option>
               </select>
            )} */}

            <motion.button
               whileTap={{ scale: 0.97, opacity: 0.95 }}
               transition={{ duration: 0.15, ease: 'easeInOut' }}
               className={`space-grotesk ml-auto px-4 py-2 rounded-lg text-sm font-medium ${getColorClass(
                  appTheme.colorTheme,
                  'buttonbg'
               )} text-white ${getColorClass(
                  appTheme.colorTheme,
                  'buttonbghover'
               )} transition-all duration-200`}
            >
               {/* <button
                  type='submit'
                  className={`space-grotesk ml-auto px-4 py-2  rounded-lg text-sm font-medium ${getColorClass(
                     appTheme.colorTheme,
                     'buttonbg'
                  )} text-white ${getColorClass(
                     appTheme.colorTheme,
                     'buttonbghover'
                  )} transition-all duration-200 `}
               > */}
               {editingTodo ? 'Update' : 'Add Task'}
               {/* </button> */}
            </motion.button>
         </div>

         {/* Note Input */}
         {appTheme.taskInterface.features.notes && (
            <>
               {showNoteInput && (
                  <div className='space-y-2'>
                     <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder='Add a note...'
                        rows={3}
                        className='inter w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300'
                     />
                  </div>
               )}
            </>
         )}

         {/* Subtasks Section */}
         <div className='space-y-2'>
            {subtasks.map((subtask, index) => (
               <div key={subtask.id || index} className='flex gap-2'>
                  <input
                     type='text'
                     value={subtask.text}
                     onChange={(e) =>
                        handleSubtaskChange(index, e.target.value)
                     }
                     className='inter flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300'
                  />
                  <motion.button
                     whileTap={{ scale: 0.97, opacity: 0.95 }}
                     transition={{ duration: 0.15, ease: 'easeInOut' }}
                     type='button'
                     onClick={() => removeSubtask(index)}
                     className='space-grotesk px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/30 transition-all duration-200'
                  >
                     Remove
                  </motion.button>
               </div>
            ))}
         </div>
      </form>
   )
})

export default TodoForm
