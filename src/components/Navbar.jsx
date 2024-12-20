import Theme from './Theme'

function Navbar() {
   return (
      <div className='navbar bg-primary xl:p-2 xl:mb-6 xl:mt-0 mb-2 mt-2 flex flex-wrap justify-between'>
         {/* <div className='flex-none'> */}
         <button
            className='btn btn-square btn-outline xl:btn-md
          btn-md  hover:ring-base-100 hover:ring-2 rounded-none'
         >
            <img
               style={{ width: 'auto', height: 'auto' }}
               src='/checklist.gif'
               alt='todoicon'
            />
         </button>
         {/* </div> */}
         {/* <div className='flex-1'> */}
         <a className='m-2 xl:text-5xl text-3xl font-serif text-primary-content font-bold text-center flex flex-shrink-4'>
            To-Do App
         </a>
         {/* </div> */}
         {/* <div className='flex-none'> */}
         <Theme />
         {/* </div> */}
      </div>
   )
}
export default Navbar
