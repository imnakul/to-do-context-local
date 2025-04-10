import { useState, useRef, useEffect } from 'react'
import {
   FaEdit,
   FaTrash,
   FaCheck,
   FaClock,
   FaTags,
   FaList,
   FaStickyNote,
   FaChevronDown,
   FaChevronRight,
   FaLayerGroup,
} from 'react-icons/fa'
import TodoForm from './TodoForm'
import { useAppTheme } from '../contexts/AppThemeContext'
import { useDispatch, useSelector } from 'react-redux'
import { updateTodo, deleteTodo } from '../store/TodoSlice.js' // Import Redux actions
import { FcHighPriority, FcLowPriority, FcMediumPriority } from 'react-icons/fc'
import { motion } from 'framer-motion'

function TodoItem({ todo }) {
   const dispatch = useDispatch() // Redux Dispatch
   const [isEditing, setIsEditing] = useState(false)
   const [editedTodo, setEditedTodo] = useState(todo.todo)
   const [showSubtasks, setShowSubtasks] = useState(false)
   const [showNote, setShowNote] = useState(false)
   const noteRef = useRef(null)
   const { appTheme, getColorClass } = useAppTheme()
   let notesHidden = !appTheme.taskInterface.features.notes
   let subtasksHidden = !appTheme.taskInterface.features.subtasks
   let dueDateHidden = !appTheme.taskInterface.features.dueDate
   let stageHidden = !appTheme.taskInterface.features.status

   useEffect(() => {
      if (notesHidden) {
         setShowNote(false)
      }
      if (subtasksHidden) setShowSubtasks(false)
   })

   const handleEdit = () => {
      setIsEditing(!isEditing)
   }

   const handleSave = () => {
      dispatch(
         updateTodo({ id: todo.id, updatedTodo: { ...todo, todo: editedTodo } })
      )
      setIsEditing(false)
   }

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         handleSave()
      }
   }

   const handleDelete = () => {
      if (window.confirm('Are you sure you want to delete this task?')) {
         dispatch(deleteTodo(todo.id))
      }
   }

   const handleToggleComplete = () => {
      dispatch(
         updateTodo({
            id: todo.id,
            updatedTodo: { ...todo, completed: !todo.completed },
         })
      )

      if (!todo.completed) {
         handleConfetti()
      }
   }

   const handleConfetti = async () => {
      const confetti = (await import('canvas-confetti')).default
      const shapes = ['square', 'circle']
      confetti({
         origin: { x: 0.5, y: 0.1 },
         angle: 270.0906564243709, // Converted angle for canvas-confetti
         spread: 120,
         particleCount: 200,
         startVelocity: 30,
         gravity: 1.3,
         ticks: 300,
         decay: 0.9,
         scalar: 1,
         drift: 0,
         shapes,
         colors: ['#FFFFFF', '#F97316', '#3B82F6', '#10B981', '#F59E0B'],
      })
   }

   const handleToggleSubtask = (subtaskId) => {
      const updatedSubtasks = todo.subtasks.map((subtask) =>
         subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
      )

      dispatch(
         updateTodo({
            id: todo.id,
            updatedTodo: { ...todo, subtasks: updatedSubtasks },
         })
      )
   }

   const handleDeleteSubtask = (subtaskId) => {
      const updatedSubtasks = todo.subtasks.filter(
         (subtask) => subtask.id !== subtaskId
      )
      dispatch(
         updateTodo({
            id: todo.id,
            updatedTodo: { ...todo, subtasks: updatedSubtasks },
         })
      )
   }

   const handleStageChange = (newStage) => {
      dispatch(
         updateTodo({ id: todo.id, updatedTodo: { ...todo, stage: newStage } })
      )
   }

   const getPriorityColor = (priority) => {
      switch (priority) {
         case 'high':
            return 'text-red-500 dark:text-red-400 sm:bg-transparent dark:sm:bg-transparent bg-red-100 dark:bg-red-900/30 sm:px-0 sm:py-0 px-2 py-1 rounded-md'
         case 'medium':
            return 'text-yellow-500 dark:text-yellow-400 sm:bg-transparent dark:sm:bg-transparent bg-yellow-100 dark:bg-yellow-900/30 sm:px-0 sm:py-0 px-2 py-1 rounded-md'
         case 'low':
            return 'text-green-500 dark:text-green-400 sm:bg-transparent dark:sm:bg-transparent bg-green-100 dark:bg-green-900/30 sm:px-0 sm:py-0 px-2 py-1 rounded-md'
         default:
            return 'text-gray-500 dark:text-gray-400 sm:bg-transparent dark:sm:bg-transparent bg-gray-100 dark:bg-gray-700 sm:px-0 sm:py-0 px-2 py-1 rounded-md'
      }
   }

   const getStageColor = (stage) => {
      switch (stage) {
         case 'notStarted':
            return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 text-xs space-grotesk'
         case 'inProgress':
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs space-grotesk'
         case 'completed':
            return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-xs space-grotesk'
         default:
            return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs space-grotesk'
      }
   }

   const getStageName = (stage) => {
      switch (stage) {
         case 'notStarted':
            return 'Not Started'
         case 'inProgress':
            return 'In Progress'
         case 'completed':
            return 'Completed'
         default:
            return 'Unknown'
      }
   }

   const getCategoryEmoji = (category) => {
      switch (category) {
         case 'work':
            return '💼'
         case 'personal':
            return '👤'
         case 'learning':
            return '📚'
         default:
            return '📝'
      }
   }

   const completedSubtasks =
      todo.subtasks?.filter((subtask) => subtask.completed).length || 0
   const totalSubtasks = todo.subtasks?.length || 0

   const isOverdue =
      todo.dueDate &&
      new Date(todo.dueDate).setHours(0, 0, 0, 0) <
         new Date().setHours(0, 0, 0, 0) &&
      !todo.completed
   const isDueToday =
      todo.dueDate &&
      new Date(todo.dueDate).setHours(0, 0, 0, 0) ===
         new Date().setHours(0, 0, 0, 0) &&
      !todo.completed

   useEffect(() => {
      const handleClickOutside = (e) => {
         if (noteRef.current && !noteRef.current.contains(e.target)) {
            setShowNote(false)
         }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [])

   if (isEditing) {
      return (
         <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4'>
            <TodoForm
               editingTodo={todo}
               onCancelEdit={() => setIsEditing(false)}
            />
         </div>
      )
   }

   return (
      <div
         className={`group  ${getColorClass(
            appTheme.colorTheme,
            'background'
         )} ${getColorClass(appTheme.colorTheme, 'hover')}  ${getColorClass(
            appTheme.colorTheme,
            'shadow'
         )} p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 `}
      >
         <div className='flex flex-col sm:flex sm:flex-row items-start sm:gap-4 gap-1'>
            {/* Checkbox and Main Content */}
            <div className='flex-1 '>
               <div className='flex items-center gap-2'>
                  <input
                     type='checkbox'
                     checked={todo.completed}
                     onChange={handleToggleComplete}
                     className='w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500'
                  />
                  <div
                     className={`inter text-gray-900 dark:text-gray-100 break-words ${
                        todo.completed
                           ? 'line-through text-gray-500 dark:text-gray-400'
                           : ''
                     }`}
                  >
                     {todo.todo}
                  </div>
               </div>

               {/* Mobile-friendly metadata */}
               <div className='mt-2 flex sm:flex-wrap sm:text-sm sm:gap-3 gap-2 sm:w-96 w-96'>
                  {appTheme.taskInterface.features.priority && (
                     <span className={`${getPriorityColor(todo.priority)}`}>
                        <span className='inter text-xs flex items-center gap-1 sm:pt-1'>
                           {todo.priority === 'high' && (
                              <FcHighPriority className='sm:block hidden size-4' />
                           )}
                           {todo.priority === 'medium' && (
                              <FcMediumPriority className='sm:block hidden size-4' />
                           )}
                           {todo.priority === 'low' && (
                              <FcLowPriority className='sm:block hidden size-4' />
                           )}
                           {todo.priority}
                        </span>
                     </span>
                  )}
                  {appTheme.taskInterface.features.category && (
                     <>
                        <span className='inter text-xs sm:text-gray-600 sm:dark:text-gray-400 flex items-center gap-1 sm:bg-transparent dark:sm:bg-transparent text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 sm:px-0 sm:py-0 px-2 py-1 rounded-md'>
                           <FaTags className='sm:block hidden w-4 h-4' />
                           {todo.category}
                        </span>
                     </>
                  )}
                  {todo.dueDate && (
                     <>
                        {!dueDateHidden && (
                           <span className='inter flex items-center gap-1'>
                              <FaClock className='sm:block hidden w-3 h-3 flex-shrink-0 dark:text-gray-400' />
                              {isOverdue ? (
                                 <span className='px-1 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-md'>
                                    Due Date Passed
                                 </span>
                              ) : isDueToday ? (
                                 <span className='px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-md'>
                                    Due Today
                                 </span>
                              ) : (
                                 <span className='text-gray-600 dark:text-gray-400'>
                                    {new Date(
                                       todo.dueDate
                                    ).toLocaleDateString()}
                                 </span>
                              )}
                           </span>
                        )}
                     </>
                  )}
                  {/* Stage Status */}
                  {!stageHidden && (
                     <div className='relative group/stage'>
                        <span
                           className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                              todo.completed
                                 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300'
                                 : getStageColor(todo.stage)
                           } ${
                              !todo.completed
                                 ? 'group-hover/stage:opacity-0'
                                 : ''
                           }`}
                        >
                           <FaLayerGroup className='sm:block hidden w-3 h-3 ' />
                           <span className='text-xs inter'>
                              {todo.completed
                                 ? 'Completed'
                                 : getStageName(todo.stage)}
                           </span>
                        </span>
                        {!todo.completed && (
                           <select
                              value={todo.stage || 'notStarted'}
                              onChange={(e) =>
                                 handleStageChange(e.target.value)
                              }
                              className=' absolute left-0 top-0 w-full h-full opacity-0 group-hover/stage:opacity-100 cursor-pointer disabled:cursor-not-allowed bg-transparent dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 appearance-none px-2 py-1'
                              disabled={todo.completed}
                           >
                              <option
                                 value='notStarted'
                                 className='dark:bg-gray-800 dark:text-gray-200 px-2 py-1 text-xs'
                              >
                                 Not Started
                              </option>
                              <option
                                 value='inProgress'
                                 className='dark:bg-gray-800 dark:text-gray-200 px-2 py-1 text-xs'
                              >
                                 In Progress
                              </option>
                           </select>
                        )}
                     </div>
                  )}
               </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center sm:gap-3 gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200'>
               {!todo.completed && (
                  <>
                     {todo.note && (
                        <div className='relative' ref={noteRef}>
                           {/* <button
                              onClick={() => {
                                 setShowNote(!showNote)
                              }}
                              className={`p-2 rounded-lg text-gray-500 ${getColorClass(
                                 appTheme.colorTheme,
                                 'hovertext'
                              )}  ${getColorClass(
                                 appTheme.colorTheme,
                                 'buttonbghover'
                              )} dark:text-gray-400 ${
                                 notesHidden && 'cursor-not-allowed'
                              }`}
                              title={
                                 notesHidden
                                    ? 'Notes Feature Hidden'
                                    : showNote
                                    ? 'Hide Note'
                                    : 'Show Note'
                              }

                           > */}
                           <motion.button
                              whileHover={{ y: -2, rotate: -5 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                              onClick={() => {
                                 setShowNote(!showNote)
                              }}
                              className={`p-2 rounded-lg text-gray-500 ${getColorClass(
                                 appTheme.colorTheme,
                                 'hovertext'
                              )}  dark:text-gray-400 ${
                                 notesHidden && 'cursor-not-allowed'
                              }`}
                              title={
                                 notesHidden
                                    ? 'Notes Feature Hidden'
                                    : showNote
                                    ? 'Hide Note'
                                    : 'Show Note'
                              }
                           >
                              <FaStickyNote className='w-4 h-4' />
                           </motion.button>
                           {/* </button> */}
                           {showNote && (
                              <div className='absolute right-0 mt-2 w-64 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10'>
                                 <p className='inter text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
                                    {todo.note}
                                 </p>
                              </div>
                           )}
                        </div>
                     )}

                     {/* <button
                        onClick={() => setIsEditing(true)}
                        className={`p-2 rounded-lg text-gray-500 ${getColorClass(
                           appTheme.colorTheme,
                           'hovertext'
                        )}  ${getColorClass(
                           appTheme.colorTheme,
                           'buttonbghover'
                        )}  dark:text-gray-400 `}
                     > */}
                     <motion.button
                        whileHover={{ y: -2, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsEditing(true)}
                        className={`p-2 rounded-lg text-gray-500 ${getColorClass(
                           appTheme.colorTheme,
                           'hovertext'
                        )}    dark:text-gray-400 `}
                     >
                        <FaEdit className='w-4 h-4' />
                     </motion.button>
                     {/* </button> */}
                  </>
               )}

               {/* <button
                  onClick={handleDelete}
                  className='p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30'
               > */}
               <motion.button
                  whileHover={{ y: -2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleDelete}
                  className={`p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 `}
               >
                  <FaTrash className='w-4 h-4' />
               </motion.button>
               {/* </button> */}
            </div>
         </div>

         {/* Subtasks Section */}
         {!subtasksHidden && (
            <>
               {todo.subtasks &&
                  todo.subtasks.length > 0 &&
                  !todo.completed && (
                     <div className='mt-3 pl-7'>
                        <button
                           onClick={() => setShowSubtasks(!showSubtasks)}
                           className={`space-grotesk flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ${getColorClass(
                              appTheme.colorTheme,
                              'hovertext'
                           )} transition-colors duration-200`}
                        >
                           {showSubtasks ? (
                              <FaChevronDown className='w-3 h-3' />
                           ) : (
                              <FaChevronRight className='w-3 h-3' />
                           )}
                           <FaList className='w-3 h-3' />
                           <span className='inter'>
                              Subtasks (
                              {
                                 todo.subtasks.filter((st) => st.completed)
                                    .length
                              }
                              /{todo.subtasks.length})
                           </span>
                        </button>

                        {showSubtasks && (
                           <div className='mt-2 space-y-2'>
                              {todo.subtasks.map((subtask) => (
                                 <div
                                    key={subtask.id}
                                    className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'
                                 >
                                    <input
                                       type='checkbox'
                                       checked={subtask.completed}
                                       onChange={() =>
                                          handleToggleSubtask(subtask.id)
                                       }
                                       className={`w-4 h-4 rounded border-gray-300 ${getColorClass(
                                          appTheme.colorTheme,
                                          'text'
                                       )}
                                 ${getColorClass(appTheme.colorTheme, 'ring')}`}
                                       disabled={todo.completed}
                                    />
                                    <span
                                       className={
                                          subtask.completed
                                             ? 'line-through'
                                             : ''
                                       }
                                    >
                                       {subtask.text}
                                    </span>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  )}
            </>
         )}
      </div>
   )
}

export default TodoItem
