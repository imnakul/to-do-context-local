import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import {
   FaSun,
   FaMoon,
   FaCog,
   FaComments,
   FaChevronDown,
   FaPalette,
} from 'react-icons/fa'
import { IoSyncCircleSharp } from 'react-icons/io5'
import { MdOutlineBackup, MdOutlineContactPage } from 'react-icons/md'
import { useAppTheme } from '../contexts/AppThemeContext'
import ContactForm from './ContactForm'
import TaskBackups from './TaskBackups'
import ThemeSettings from './ThemeSettings'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeWipeTransition from './ThemeTransitionOverlay'
import ContactDetails from './ContactDetails'

function Navbar() {
   const { isDarkMode, toggleTheme } = useTheme()
   const [showDropdown, setShowDropdown] = useState(false)
   const [showModal, setShowModal] = useState(false)
   const [modalContent, setModalContent] = useState(null)
   const dropdownRef = useRef(null)
   const { appTheme, getColorClass } = useAppTheme()
   const [isAnimating, setIsAnimating] = useState(false)
   const [direction, setDirection] = useState(true)

   const overlayVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, transition: { duration: 0.2 } },
   }

   const modalVariants = {
      hidden: {
         opacity: 0,
         y: 40,
         scale: 0.95,
      },
      visible: {
         opacity: 1,
         y: 0,
         scale: 1,
         transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, // nice easing
      },
      exit: {
         opacity: 0,
         y: 20,
         scale: 0.95,
         transition: { duration: 0.25 },
      },
   }

   // Handle click outside to close dropdown
   useEffect(() => {
      function handleClickOutside(event) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
         ) {
            setShowDropdown(false)
         }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
   }, [])

   const handleThemeToggle = () => {
      if (isAnimating) return // Prevent overlapping animation

      setIsAnimating(true)
      setDirection((prev) => !prev) // Alternate direction each time

      setTimeout(() => {
         toggleTheme() // Flip theme mid-animation
      }, 500) // Midway

      setTimeout(() => {
         setIsAnimating(false)
      }, 500) // After animation ends
   }

   const handleOpenModal = (content) => {
      setModalContent(content)
      setShowModal(true)
      setShowDropdown(false) // Close dropdown when opening modal
   }

   return (
      <>
         <nav
            className={` ${getColorClass(
               appTheme.colorTheme,
               'navbar'
            )}  shadow-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 w-screen z-20 transition-all duration-200`}
         >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
               <div className='flex items-center justify-between h-14 sm:h-15'>
                  {/* Logo/Title */}
                  <div className='flex-shrink-0 flex items-center gap-4'>
                     {/* <FaTasks className='sm:size-7 size-5 dark:text-white text-black' /> */}
                     <img
                        src='/3.png'
                        alt='Logo'
                        className={`filter-glow-logo  size-10 p-1 rounded-full bg-gray-800 dark:bg-gray-200 shadow-md`}
                     />
                     {/* border-2 ${getColorClass(
                           appTheme.colorTheme,
                           'border'
                        )} */}
                     <h1
                        className='antialiased space-grotesk text-lg sm:text-2xl font-extrabold text-gray-800 dark:text-white 
                     '
                     >
                        FlexiTASKS
                     </h1>
                  </div>

                  {/* Right side buttons */}
                  <div className='flex items-center gap-4'>
                     {/* Theme Dropdown */}
                     <div className='relative' ref={dropdownRef}>
                        <button
                           onClick={() => setShowDropdown(!showDropdown)}
                           className={`
                              flex items-center gap-2 px-3 py-2 rounded-lg
                              dark:text-white/80 text-gray-800/80
                              ${getColorClass(appTheme.colorTheme, 'hovertext')}
                              ${getColorClass(appTheme.colorTheme)}
                              transition-all duration-200
                              ${
                                 showDropdown
                                    ? `${getColorClass(
                                         appTheme.colorTheme
                                      )} ${getColorClass(
                                         appTheme.colorTheme,
                                         'text'
                                      )}`
                                    : ''
                              }
                           `}
                        >
                           <FaCog
                              className={`sm:size-5 size-4 transition-transform duration-200 ${
                                 showDropdown ? 'rotate-180' : ''
                              }`}
                           />
                           <FaChevronDown
                              className={`sm:size-3 size-2 transition-transform duration-200 ${
                                 showDropdown ? 'rotate-180' : ''
                              }`}
                           />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                           <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-right'>
                              <button
                                 onClick={() => handleOpenModal('theme')}
                                 className='w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-150'
                              >
                                 <FaPalette className='w-4 h-4 text-green-500' />
                                 <span className='space-grotesk  text-sm text-gray-700 dark:text-gray-300'>
                                    Theme Settings
                                 </span>
                              </button>

                              <button
                                 onClick={() => handleOpenModal('backup')}
                                 className='w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-150'
                              >
                                 <MdOutlineBackup className='w-5 h-5  dark:text-white' />
                                 <span className='space-grotesk text-sm text-gray-700 dark:text-gray-300'>
                                    Tasks Backup
                                 </span>
                              </button>

                              {/* Feedback & Contact */}
                              <button
                                 onClick={() => handleOpenModal('feedback')}
                                 className='w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-150'
                              >
                                 <FaComments className='w-5 h-5 text-blue-500' />
                                 <span className='space-grotesk text-sm text-gray-700 dark:text-gray-300'>
                                    Feedback
                                 </span>
                              </button>

                              <button
                                 onClick={() => handleOpenModal('contact')}
                                 className='w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-150'
                              >
                                 <MdOutlineContactPage className='w-5 h-5  dark:text-white' />
                                 <span className='space-grotesk text-sm text-gray-700 dark:text-gray-300'>
                                    Contact
                                 </span>
                              </button>
                              <button
                                 onClick={() => handleOpenModal('sync')}
                                 className='w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-150'
                              >
                                 <IoSyncCircleSharp className='size-9 text-orange-600 dark:text-orange-400' />
                                 <span className='space-grotesk text-sm text-gray-700 dark:text-gray-300 animate-pulse'>
                                    Cross Device Sync (Coming Soon)
                                 </span>
                              </button>
                           </div>
                        )}
                     </div>

                     {/* Dark Mode Toggle - Separate button */}
                     <div className='relative'>
                        <ThemeWipeTransition
                           isAnimating={isAnimating}
                           direction={direction}
                        />
                        <button
                           onClick={handleThemeToggle}
                           type='button'
                           className={`p-2 rounded-lg dark:text-white/80 text-gray-800/80 
                              ${getColorClass(
                                 appTheme.colorTheme
                              )} ${getColorClass(
                              appTheme.colorTheme,
                              'hovertext'
                           )} transition-colors duration-200 cursor-pointer`}
                        >
                           {isDarkMode ? (
                              <FaSun className='sm:size-5 size-4' />
                           ) : (
                              <FaMoon className='sm:size-5 size-4' />
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </nav>

         <AnimatePresence>
            {showModal && (
               <motion.div
                  className='fixed inset-0 z-50 overflow-y-auto'
                  initial='hidden'
                  animate='visible'
                  exit='exit'
               >
                  {/* Overlay */}
                  <motion.div
                     className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm'
                     variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.3 } },
                        exit: { opacity: 0, transition: { duration: 0.2 } },
                     }}
                  />

                  {/* Modal Container */}
                  <div className='flex min-h-full items-center justify-center p-4'>
                     <motion.div
                        variants={{
                           hidden: { opacity: 0, y: 40, scale: 0.95 },
                           visible: {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                 duration: 0.65,
                                 ease: [0.22, 1, 0.36, 1],
                              },
                           },
                           exit: {
                              opacity: 0,
                              y: 20,
                              scale: 0.95,
                              transition: { duration: 0.45 },
                           },
                        }}
                        initial='hidden'
                        animate='visible'
                        exit='exit'
                        className={`relative transform overflow-hidden rounded-lg backdrop-blur-lg ${getColorClass(
                           appTheme.colorTheme,
                           'modal'
                        )} px-3 pt-1 pb-3 text-left shadow-xl w-[80vw] sm:w-full sm:max-w-xl sm:p-6`}
                     >
                        {/* Close Button */}
                        <div className='absolute right-0 top-0 pr-4 pt-4'>
                           <button
                              onClick={() => setShowModal(false)}
                              className='rounded-md text-gray-800 dark:text-gray-400 hover:text-gray-500 hover:bg-gray-800 p-1'
                           >
                              <span className='sr-only'>Close</span>
                              <svg
                                 className='h-6 w-6'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 strokeWidth='1.5'
                                 stroke='currentColor'
                              >
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M6 18L18 6M6 6l12 12'
                                 />
                              </svg>
                           </button>
                        </div>

                        {/* Modal Content */}
                        <div className='mt-3 text-center sm:mt-0'>
                           <h3 className='text-lg font-semibold leading-6 text-gray-50 space-grotesk'>
                              {modalContent === 'theme' && 'Theme Settings'}
                              {modalContent === 'feedback' && 'Feedback'}
                              {modalContent === 'backup' && 'Tasks Backup'}
                              {modalContent === 'contact' && (
                                 <h3 className={`text-xl font-bold  `}>
                                    Contact Me
                                 </h3>
                              )}
                              {modalContent === 'sync' && (
                                 <h3 className={`text-xl font-bold  `}>
                                    Cloud Backup + Cross Device Sync
                                 </h3>
                              )}
                           </h3>
                           <div className='mt-4'>
                              {modalContent === 'theme' && (
                                 <ThemeSettings
                                    onClose={() => setShowModal(false)}
                                    isOpen={true}
                                 />
                              )}
                              {modalContent === 'feedback' && <ContactForm />}
                              {modalContent === 'backup' && (
                                 <TaskBackups
                                    onClose={() => setShowModal(false)}
                                 />
                              )}
                              {modalContent === 'contact' && (
                                 <ContactDetails
                                    onClose={() => setShowModal(false)}
                                 />
                              )}
                              {modalContent === 'sync' && (
                                 <>
                                    <div className='flex items-center justify-center'>
                                       <img
                                          src='/coming-soon.png'
                                          className='size-52 md:size-full rounded-lg animate-pulse'
                                       ></img>
                                    </div>
                                    {/* <div className='flex flex-col items-center gap-2'>
                                       <span className='font-bold pace-grotesk text-lg text-gray-900 dark:text-gray-300'>
                                          Cross Device Sync
                                       </span>
                                       <span className='font-bold pace-grotesk text-lg text-gray-900 dark:text-gray-300'>
                                          {' '}
                                          Data backup{' '}
                                       </span>
                                       <span className='font-bold pace-grotesk text-lg text-gray-900 dark:text-gray-300'>
                                          Offline First
                                       </span>
                                    </div> */}
                                 </>
                              )}
                           </div>
                        </div>
                     </motion.div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   )
}

export default Navbar
