'use client'
import { useEffect, useRef } from 'react'

const WarpSpeedStarfield = ({ dark = 'true', particle = '#f5f5f5' }) => {
   const canvasRef = useRef(null)

   useEffect(() => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      let w, h
      const stars = Array.from({ length: 200 }, () => ({
         x: Math.random() * window.innerWidth,
         y: Math.random() * window.innerHeight,
         z: Math.random() * window.innerWidth,
      }))

      const resizeCanvas = () => {
         w = canvas.width = window.innerWidth
         h = canvas.height = window.innerHeight
      }

      const draw = () => {
         if (dark) {
            ctx.fillStyle = 'black'
         } else {
            ctx.fillStyle = 'white'
         }
         ctx.fillRect(0, 0, w, h)
         ctx.fillStyle = particle

         stars.forEach((star) => {
            star.z -= 2
            if (star.z <= 0) {
               star.x = Math.random() * w
               star.y = Math.random() * h
               star.z = w
            }

            const sx = (star.x - w / 2) * (w / star.z) + w / 2
            const sy = (star.y - h / 2) * (w / star.z) + h / 2
            const size = (1 - star.z / w) * 5

            ctx.beginPath()
            ctx.arc(sx, sy, size, 0, Math.PI * 2)
            ctx.fill()
         })

         requestAnimationFrame(draw)
      }

      resizeCanvas()
      draw()
      window.addEventListener('resize', resizeCanvas)

      return () => window.removeEventListener('resize', resizeCanvas)
   }, [dark, particle])

   return (
      <canvas
         ref={canvasRef}
         className='fixed sm:top-[65px] top-[62px] z-0 w-full h-full'
      />
   )
}

export default WarpSpeedStarfield
