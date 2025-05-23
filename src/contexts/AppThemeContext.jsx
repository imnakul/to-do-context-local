import { createContext, useContext, useState, useEffect } from 'react'
import { useScreenSize } from './useScreenSize'

const AppThemeContext = createContext()

// Default interface settings for each mode
const defaultInterfaceSettings = {
   minimal: {
      subtasks: false,
      notes: false,
      priority: false,
      dueDate: false,
      viewModes: false,
      category: false,
      status: false,
   },
   maximal: {
      subtasks: true,
      notes: true,
      priority: true,
      dueDate: true,
      viewModes: true,
      category: true,
      status: true,
   },
   custom: {
      subtasks: true,
      notes: true,
      priority: true,
      dueDate: true,
      viewModes: true,
      category: true,
      status: true,
   },
}

// Default app theme settings
// const defaultAppTheme = {
//    designBasis: 'text', // 'text' or 'icon'
//    colorTheme: 'purple', // 'red', 'orange', 'yellow', 'green', 'blue', 'purple'
//    background: 'particle', // 'particle', 'rain mode', 'wave', 'others'
//    taskInterface: {
//       mode: 'minimal', // 'minimal', 'maximal', 'custom'
//       features: defaultInterfaceSettings.minimal,
//    },
// }

// Helper function to validate app theme object
const isValidAppTheme = (theme) => {
   return (
      theme &&
      typeof theme === 'object' &&
      'designBasis' in theme &&
      'colorTheme' in theme &&
      'background' in theme &&
      'taskInterface' in theme
   )
}

const colorOptions = {
   red: {
      bg: 'bg-red-200 dark:bg-red-900',
      background: 'bg-red-200 dark:bg-red-900/20',
      hover: 'hover:border-red-600 dark:hover:border-red-600',
      shadow: 'hover:shadow-lg hover:shadow-red-500/20',
      buttonbg: 'bg-red-500 dark:bg-red-800',
      buttonbghover: 'hover:bg-red-700 dark:hover:bg-red-700',
      ring: 'focus:ring-red-800 dark:focus:ring-red-500',
      text: 'text-red-800 dark:text-red-200',
      hovertext: 'hover:text-red-500 dark:hover:text-red-400',
      navbar: 'bg-gradient-to-r from-pink-700/80 to-red-600/80',
      modal: 'bg-gradient-to-r from-pink-700/40 to-red-600/40',
      border: 'border-red-200 dark:border-red-800',
      particle: '#ff4f4f',
      toggle: 'peer-checked:bg-red-600 dark:peer-checked:bg-red-600',
   },
   orange: {
      bg: 'bg-orange-200 dark:bg-orange-900',
      background: 'bg-orange-200 dark:bg-orange-900/20',
      hover: 'hover:border-orange-600 dark:hover:border-orange-600',
      shadow: 'hover:shadow-lg hover:shadow-red-500/20',
      buttonbg: 'bg-orange-500 dark:bg-orange-800',
      buttonbghover: 'hover:bg-orange-700 dark:hover:bg-orange-700',
      ring: 'focus:ring-orange-800 dark:focus:ring-orange-500',
      text: 'text-orange-800 dark:text-orange-200',
      hovertext: 'hover:text-orange-500 dark:hover:text-orange-400',
      navbar: 'bg-gradient-to-r from-rose-400/80 to-orange-600/80',
      modal: 'bg-gradient-to-r from-rose-400/40 to-orange-600/40',
      border: 'border-orange-200 dark:border-orange-800',
      particle: '#ff904f',
      toggle: 'peer-checked:bg-orange-600 dark:peer-checked:bg-orange-600',
   },
   yellow: {
      bg: 'bg-yellow-200 dark:bg-yellow-900',
      background: 'bg-yellow-200 dark:bg-yellow-900/20',
      hover: 'hover:border-yellow-300 dark:hover:border-yellow-500',
      shadow: 'hover:shadow-lg hover:shadow-yellow-500/20',
      buttonbg: 'bg-yellow-500 dark:bg-yellow-800',
      buttonbghover: 'hover:bg-yellow-700 dark:hover:bg-yellow-700',
      ring: 'focus:ring-yellow-800 dark:focus:ring-yellow-500',
      text: 'text-yellow-800 dark:text-yellow-200',
      hovertext: 'hover:text-yellow-500 dark:hover:text-yellow-400',
      navbar: 'bg-gradient-to-r from-lime-600/80 to-yellow-600/80',
      modal: 'bg-gradient-to-r from-lime-600/40 to-yellow-600/40',
      border: 'border-yellow-200 dark:border-yellow-800',
      particle: '#ccd400',
      toggle: 'peer-checked:bg-yellow-600 dark:peer-checked:bg-yellow-600',
   },
   green: {
      bg: 'bg-green-200 dark:bg-green-900',
      background: 'bg-green-200 dark:bg-green-900/20',
      hover: 'hover:border-green-600 dark:hover:border-green-600',
      shadow: 'hover:shadow-lg hover:shadow-green-500/20',
      buttonbg: 'bg-green-500 dark:bg-green-800',
      buttonbghover: 'hover:bg-green-700 dark:hover:bg-green-700',
      ring: 'focus:ring-green-800 dark:focus:ring-green-500',
      text: 'text-green-800 dark:text-green-200',
      hovertext: 'hover:text-green-500 dark:hover:text-green-400',
      navbar: 'bg-gradient-to-r from-emerald-600/80 to-green-600/80',
      modal: 'bg-gradient-to-r from-emerald-600/40 to-green-600/40',
      border: 'border-green-200 dark:border-green-800',
      particle: '#05e31b',
      toggle: 'peer-checked:bg-green-600 dark:peer-checked:bg-green-600',
   },
   blue: {
      bg: 'bg-blue-200 dark:bg-blue-900',
      background: 'bg-blue-200 dark:bg-blue-900/20',
      hover: 'hover:border-blue-600 dark:hover:border-blue-600',
      shadow: 'hover:shadow-lg hover:shadow-blue-500/20',
      buttonbg: 'bg-blue-500 dark:bg-blue-800',
      buttonbghover: 'hover:bg-blue-700 dark:hover:bg-blue-700',
      ring: 'focus:ring-blue-800 dark:focus:ring-blue-500',
      text: 'text-blue-800 dark:text-blue-200',
      hovertext: 'hover:text-blue-500 dark:hover:text-blue-400',
      navbar: 'bg-gradient-to-r from-sky-600/80 to-blue-600/80',
      modal: 'bg-gradient-to-r from-sky-600/40 to-blue-600/40',
      border: 'border-blue-200 dark:border-blue-800',
      particle: '#029bc9',
      toggle: 'peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600',
   },
   purple: {
      bg: 'bg-purple-200 dark:bg-purple-900',
      background: 'bg-purple-200 dark:bg-purple-900/20',
      hover: 'hover:border-purple-600 dark:hover:border-purple-600',
      shadow: 'hover:shadow-lg hover:shadow-purple-500/20',
      buttonbg: 'bg-purple-500 dark:bg-purple-800',
      buttonbghover: 'hover:bg-purple-400 dark:hover:bg-purple-700',
      ring: 'focus:ring-purple-800 dark:focus:ring-purple-500',
      text: 'text-purple-800 dark:text-purple-200',
      hovertext: 'hover:text-purple-500 dark:hover:text-purple-400',
      navbar: 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80',
      modal: 'bg-gradient-to-r from-indigo-600/40 to-purple-600/40',
      border: 'border-purple-200 dark:border-purple-800',
      particle: '#9E00FF',
      toggle: 'peer-checked:bg-purple-600 dark:peer-checked:bg-purple-600',
   },
   emerald: {
      bg: 'bg-emerald-200 dark:bg-emerald-900',
      background: 'bg-emerald-200 dark:bg-emerald-900/20',
      hover: 'hover:border-emerald-600 dark:hover:border-emerald-600',
      shadow: 'hover:shadow-lg hover:shadow-emerald-500/20',
      buttonbg: 'bg-emerald-500 dark:bg-emerald-800',
      buttonbghover: 'hover:bg-emerald-400 dark:hover:bg-emerald-700',
      ring: 'focus:ring-emerald-800 dark:focus:ring-emerald-500',
      text: 'text-emerald-800 dark:text-emerald-200',
      hovertext: 'hover:text-emerald-500 dark:hover:text-emerald-400',
      navbar: 'bg-gradient-to-r from-purple-600/80 to-emerald-600/80',
      modal: 'bg-gradient-to-r from-purple-600/40 to-emerald-600/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      particle: '#02c97d',
      toggle: 'peer-checked:bg-emerald-600 dark:peer-checked:bg-emerald-600',
   },
   cyan: {
      bg: 'bg-cyan-200 dark:bg-cyan-900',
      background: 'bg-cyan-200 dark:bg-cyan-900/20',
      hover: 'hover:border-cyan-600 dark:hover:border-cyan-600',
      shadow: 'hover:shadow-lg hover:shadow-cyan-500/20',
      buttonbg: 'bg-cyan-500 dark:bg-cyan-800',
      buttonbghover: 'hover:bg-cyan-400 dark:hover:bg-cyan-700',
      ring: 'focus:ring-cyan-800 dark:focus:ring-cyan-500',
      text: 'text-cyan-800 dark:text-cyan-200',
      hovertext: 'hover:text-cyan-500 dark:hover:text-cyan-400',
      navbar: 'bg-gradient-to-r from-cyan-400/80 via-sky-500/80 to-cyan-600/80',

      modal: 'bg-gradient-to-r from-cyan-400/40 via-sky-500/40 to-cyan-600/40',
      border: 'border-cyan-200 dark:border-cyan-800',
      // particle: '#4fffe5',
      particle: '#02a8c9',
      toggle: 'peer-checked:bg-cyan-600 dark:peer-checked:bg-cyan-600',
   },
   fuchsia: {
      bg: 'bg-fuchsia-200 dark:bg-fuchsia-900',
      background: 'bg-fuchsia-200 dark:bg-fuchsia-900/20',
      hover: 'hover:border-fuchsia-600 dark:hover:border-fuchsia-600',
      shadow: 'hover:shadow-lg hover:shadow-fuchsia-500/20',
      buttonbg: 'bg-fuchsia-500 dark:bg-fuchsia-800',
      buttonbghover: 'hover:bg-fuchsia-400 dark:hover:bg-fuchsia-700',
      ring: 'focus:ring-fuchsia-800 dark:focus:ring-fuchsia-500',
      text: 'text-fuchsia-800 dark:text-fuchsia-200',
      hovertext: 'hover:text-fuchsia-500 dark:hover:text-fuchsia-400',
      navbar: 'bg-gradient-to-r from-indigo-600/80 to-fuchsia-600/80',
      modal: 'bg-gradient-to-r from-indigo-600/40 to-fuchsia-600/40',
      border: 'border-fuchsia-200 dark:border-fuchsia-800',
      particle: '#f94fff',
      toggle: 'peer-checked:bg-fuchsia-600 dark:peer-checked:bg-fuchsia-600',
   },
   rgb: {
      bg: 'bg-black/20 dark:bg-white/5', // Semi-transparent for light overlay
      background: 'bg-white/30 dark:bg-white/5',
      hover: 'hover:border-cyan-400 dark:hover:border-green-400',
      shadow:
         'hover:shadow-lg hover:shadow-cyan-300/30 dark:hover:shadow-green-400/10',
      buttonbg:
         'bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 text-white dark:from-cyan-600 dark:via-pink-600 dark:to-yellow-600',
      buttonbghover: 'hover:opacity-90 dark:hover:opacity-80',
      ring: 'focus:ring-cyan-500 dark:focus:ring-green-400',
      text: 'text-cyan-700 dark:text-green-300',
      hovertext: 'hover:text-pink-500 dark:hover:text-yellow-400',
      navbar: 'rgb-gradient', // Your gradient class here
      modal: 'rgb-modal', // The gradient background modal
      border: 'border-cyan-200 dark:border-green-900/30',
      particle: '#00f0ff', // Could be cyan or mix of the RGB tones
      toggle: 'peer-checked:bg-pink-500 dark:peer-checked:bg-green-500',
   },
   rose: {
      bg: 'bg-rose-200 dark:bg-rose-900',
      background: 'bg-rose-200 dark:bg-rose-900/20',
      hover: 'hover:border-rose-600 dark:hover:border-rose-600',
      shadow: 'hover:shadow-lg hover:shadow-rose-500/20',
      buttonbg: 'bg-rose-500 dark:bg-rose-800',
      buttonbghover: 'hover:bg-rose-400 dark:hover:bg-rose-700',
      ring: 'focus:ring-rose-800 dark:focus:ring-rose-500',
      text: 'text-rose-800 dark:text-rose-200',
      hovertext: 'hover:text-rose-500 dark:hover:text-rose-400',
      navbar: 'bg-gradient-to-r from-indigo-600/80 to-rose-600/80',
      modal: 'bg-gradient-to-r from-indigo-600/40 to-rose-600/40',
      border: 'border-rose-200 dark:border-rose-800',
      particle: '#f94fff',
      toggle: 'peer-checked:bg-rose-600 dark:peer-checked:bg-rose-600',
   },
   none: {
      bg: '',
      hover: '',
      shadow: '',
      buttonbg: 'bg-gray-500 dark:bg-gray-800',
      buttonbghover: '',
      ring: '',
      text: '',
      hovertext: '',
      navbar: '',
      modal: '',
      border: '',
      particle: '#5c5a54',
      toggle: 'peer-checked:bg-gray-600 dark:peer-checked:bg-gray-600',
   },
}

// Function to get Tailwind class dynamically
const getColorClass = (themeColor, type = 'bg') => {
   return colorOptions[themeColor]?.[type] || ''
}

export function AppThemeProvider({ children }) {
   const screenSize = useScreenSize()

   // 🔧 MODIFIED: Get default app theme based on screen size
   const getDefaultAppThemeBasedOnScreen = () => {
      let mode = 'minimal'
      if (screenSize.isLarge) mode = 'maximal'
      else if (screenSize.isMedium) mode = 'custom'
      // console.log('screenSize', screenSize)
      // console.log('selected Mode value based on screen size came', mode)
      return {
         designBasis: 'text',
         colorTheme: screenSize.isSmall
            ? 'purple'
            : screenSize.isMedium
            ? 'cyan'
            : 'purple',
         background: 'particle',
         taskInterface: {
            mode,
            features: defaultInterfaceSettings[mode],
         },
      }
   }

   // 🔧 MODIFIED: Initialize state from localStorage or screen-based default
   const [appTheme, setAppTheme] = useState(() => {
      const defaultTheme = getDefaultAppThemeBasedOnScreen()
      try {
         const savedTheme = localStorage.getItem('appTheme')
         if (!savedTheme) {
            // const defaultTheme = getDefaultAppThemeBasedOnScreen()
            // console.log('default theme', defaultTheme)
            localStorage.setItem('appTheme', JSON.stringify(defaultTheme))
            return defaultTheme
         }

         const parsedTheme = JSON.parse(savedTheme)
         if (!isValidAppTheme(parsedTheme)) {
            console.warn(
               'Invalid app theme data found in localStorage, using screen-based theme'
            )
            const defaultTheme = getDefaultAppThemeBasedOnScreen()
            localStorage.setItem('appTheme', JSON.stringify(defaultTheme))
            return defaultTheme
         }

         // Ensure taskInterface has the correct structure
         if (!parsedTheme.taskInterface || !parsedTheme.taskInterface.mode) {
            parsedTheme.taskInterface = {
               mode: 'minimal',
               features: defaultInterfaceSettings.minimal,
            }
         }

         return parsedTheme
      } catch (error) {
         console.warn('Error parsing app theme from localStorage:', error)
         const defaultTheme = getDefaultAppThemeBasedOnScreen()
         localStorage.setItem('appTheme', JSON.stringify(defaultTheme))
         return defaultTheme
      }
   })

   // ⏺ NO CHANGE: Persist theme to localStorage when user updates it
   useEffect(() => {
      try {
         localStorage.setItem('appTheme', JSON.stringify(appTheme))
      } catch (error) {
         console.error('Error saving app theme to localStorage:', error)
      }
   }, [appTheme])

   // ⏺ NO CHANGE: Apply theme to document
   useEffect(() => {
      try {
         document.documentElement.setAttribute(
            'data-color-theme',
            appTheme.colorTheme
         )
         document.documentElement.setAttribute(
            'data-background',
            appTheme.background
         )
         document.documentElement.setAttribute(
            'data-design-basis',
            appTheme.designBasis
         )
      } catch (error) {
         console.error('Error applying app theme to document:', error)
      }
   }, [appTheme.colorTheme, appTheme.background, appTheme.designBasis])

   // ⏺ NO CHANGE: Theme setter functions
   const setDesignBasis = (basis) => {
      setAppTheme((prev) => ({ ...prev, designBasis: basis }))
   }

   const setColorTheme = (color) => {
      setAppTheme((prev) => ({ ...prev, colorTheme: color }))
   }

   const setBackground = (bg) => {
      setAppTheme((prev) => ({ ...prev, background: bg }))
   }

   const setTaskInterface = (mode, features = null) => {
      setAppTheme((prev) => ({
         ...prev,
         taskInterface: {
            mode,
            features: features || defaultInterfaceSettings[mode],
         },
      }))
   }

   const updateTaskFeatures = (features) => {
      if (appTheme.taskInterface.mode !== 'custom') return
      setAppTheme((prev) => ({
         ...prev,
         taskInterface: {
            ...prev.taskInterface,
            features,
         },
      }))
   }

   const value = {
      appTheme,
      setDesignBasis,
      setColorTheme,
      setBackground,
      setTaskInterface,
      updateTaskFeatures,
      getColorClass,
   }

   return (
      <AppThemeContext.Provider value={value}>
         {children}
      </AppThemeContext.Provider>
   )
}

export function useAppTheme() {
   const context = useContext(AppThemeContext)
   if (!context) {
      throw new Error('useAppTheme must be used within an AppThemeProvider')
   }
   return context
}

// Export default interface settings for use in other components
export { defaultInterfaceSettings }
