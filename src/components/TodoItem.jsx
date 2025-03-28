import { useState } from 'react'
import { useTodo } from '../contexts/ToDoContext'

function TodoItem({ todo }) {
   const {
      updateTodo,
      deleteTodo,
      toggleComplete,
      toggleSubtask,
      deleteSubtask,
   } = useTodo()
   const [isEditing, setIsEditing] = useState(false)
   const [editedTodo, setEditedTodo] = useState(todo.todo)
   const [showSubtasks, setShowSubtasks] = useState(false)

   const handleEdit = () => {
      setIsEditing(true)
   }

   const handleSave = () => {
      updateTodo(todo.id, { ...todo, todo: editedTodo })
      setIsEditing(false)
   }

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         handleSave()
      }
   }

   const handleDelete = () => {
      if (window.confirm('Are you sure you want to delete this task?')) {
         deleteTodo(todo.id)
      }
   }

   const handleToggleComplete = () => {
      toggleComplete(todo.id)
   }

   const handleToggleSubtask = (subtaskId) => {
      toggleSubtask(todo.id, subtaskId)
   }

   const handleDeleteSubtask = (subtaskId) => {
      deleteSubtask(todo.id, subtaskId)
   }

   const handleStageChange = (newStage) => {
      updateTodo(todo.id, { ...todo, stage: newStage })
   }

   const getPriorityColor = (priority) => {
      switch (priority) {
         case 'high':
            return 'text-red-500'
         case 'medium':
            return 'text-yellow-500'
         case 'low':
            return 'text-green-500'
         default:
            return 'text-gray-500'
      }
   }

   const getStageColor = (stage) => {
      switch (stage) {
         case 'notStarted':
            return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded'
         case 'inProgress':
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded'
         case 'completed':
            return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-2 py-1 rounded'
         default:
            return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded'
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

   return (
      <div className='group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-300 dark:hover:border-purple-500 hover:scale-[1.02] z-10'>
         <div className='flex items-start gap-4'>
            <button
               onClick={handleToggleComplete}
               className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
                  todo.completed
                     ? 'bg-purple-500 border-purple-500'
                     : 'border-gray-300 dark:border-gray-600'
               }`}
            >
               {todo.completed && (
                  <svg
                     className='w-full h-full text-white'
                     fill='none'
                     stroke='currentColor'
                     viewBox='0 0 24 24'
                  >
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                     />
                  </svg>
               )}
            </button>

            <div className='flex-1 min-w-0'>
               {isEditing ? (
                  <input
                     type='text'
                     value={editedTodo}
                     onChange={(e) => setEditedTodo(e.target.value)}
                     onBlur={handleSave}
                     onKeyDown={handleKeyDown}
                     className='w-full bg-transparent border-b-2 border-purple-500 focus:outline-none text-gray-900 dark:text-gray-100'
                     autoFocus
                  />
               ) : (
                  <div className='flex items-center gap-2'>
                     <p
                        className={`text-gray-900 dark:text-gray-100 ${
                           todo.completed
                              ? 'line-through text-gray-500 dark:text-gray-400'
                              : ''
                        }`}
                     >
                        {todo.todo}
                     </p>
                     <div className='flex items-center gap-2 text-sm'>
                        <span className={getPriorityColor(todo.priority)}>
                           {todo.priority.charAt(0).toUpperCase() +
                              todo.priority.slice(1)}
                        </span>
                        <span className='text-gray-500 dark:text-gray-400'>
                           •
                        </span>
                        <span className={getStageColor(todo.stage)}>
                           {todo.stage.charAt(0).toUpperCase() +
                              todo.stage.slice(1)}
                        </span>
                        <span className='text-gray-500 dark:text-gray-400'>
                           •
                        </span>
                        <span className='text-gray-500 dark:text-gray-400'>
                           {getCategoryEmoji(todo.category)} {todo.category}
                        </span>
                        {todo.dueDate && (
                           <>
                              <span className='text-gray-500 dark:text-gray-400'>
                                 •
                              </span>
                              <span className='text-gray-500 dark:text-gray-400'>
                                 📅{' '}
                                 {new Date(todo.dueDate).toLocaleDateString()}
                              </span>
                           </>
                        )}
                        {todo.isRecurring && (
                           <>
                              <span className='text-gray-500 dark:text-gray-400'>
                                 •
                              </span>
                              <span className='text-purple-500'>
                                 🔄 {todo.recurringInterval}
                              </span>
                           </>
                        )}
                     </div>
                  </div>
               )}

               {todo.subtasks && todo.subtasks.length > 0 && (
                  <div className='mt-2'>
                     <button
                        onClick={() => setShowSubtasks(!showSubtasks)}
                        className='text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400'
                     >
                        {showSubtasks ? 'Hide Subtasks' : 'Show Subtasks'} (
                        {completedSubtasks}/{totalSubtasks})
                     </button>
                     {showSubtasks && (
                        <div className='mt-2 space-y-2 pl-6'>
                           {todo.subtasks.map((subtask) => (
                              <div
                                 key={subtask.id}
                                 className='flex items-center gap-2 text-sm'
                              >
                                 <button
                                    onClick={() =>
                                       handleToggleSubtask(subtask.id)
                                    }
                                    className={`w-4 h-4 rounded-full border-2 transition-colors duration-200 ${
                                       subtask.completed
                                          ? 'bg-purple-500 border-purple-500'
                                          : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                 >
                                    {subtask.completed && (
                                       <svg
                                          className='w-full h-full text-white'
                                          fill='none'
                                          stroke='currentColor'
                                          viewBox='0 0 24 24'
                                       >
                                          <path
                                             strokeLinecap='round'
                                             strokeLinejoin='round'
                                             strokeWidth={2}
                                             d='M5 13l4 4L19 7'
                                          />
                                       </svg>
                                    )}
                                 </button>
                                 <span
                                    className={`${
                                       subtask.completed
                                          ? 'text-gray-500 dark:text-gray-400 line-through'
                                          : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                 >
                                    {subtask.text}
                                 </span>
                                 <button
                                    onClick={() =>
                                       handleDeleteSubtask(subtask.id)
                                    }
                                    className='text-red-500 hover:text-red-600'
                                 >
                                    ×
                                 </button>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               )}
            </div>

            <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
               <div className='flex items-center gap-2'>
                  <select
                     value={todo.stage || 'notStarted'}
                     onChange={(e) => handleStageChange(e.target.value)}
                     className='select select-bordered select-sm bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-gray-900 dark:text-gray-100 py-1 px-3'
                  >
                     <option value='notStarted'>Not Started</option>
                     <option value='inProgress'>In Progress</option>
                  </select>
               </div>
               <button
                  onClick={handleEdit}
                  className='p-2 text-gray-500 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200'
               >
                  <svg
                     className='w-5 h-5'
                     fill='none'
                     stroke='currentColor'
                     viewBox='0 0 24 24'
                  >
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                     />
                  </svg>
               </button>
               <button
                  onClick={handleDelete}
                  className='p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200'
               >
                  <svg
                     className='w-5 h-5'
                     fill='none'
                     stroke='currentColor'
                     viewBox='0 0 24 24'
                  >
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                     />
                  </svg>
               </button>
            </div>
         </div>
      </div>
   )
}

export default TodoItem
