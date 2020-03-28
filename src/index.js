import { Application, ParticleContainer, Sprite } from 'pixi.js'
import ParticleImage from './c.png'
import './index.css'

const COLORS = [
  0xfefefe, // white
  0x7a7a78, // grey
  0xfbcb00, // yellow
  0xFF6B6B, // red
  0xFF9999, // pink
  0xBDB4F0,
  0xC9BFBF
]
const PI2 = Math.PI * 2
const mouse = { x: 0, y: 0 }
const center = {
  x: window.innerWidth >> 1,
  y: window.innerHeight >> 1
}
const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  backgroundColor: 0xf3f3f3
})
const container = new ParticleContainer()
const list = []

let frame = 0
let curColor
let mousePressed = false
let speed = 1
let scale

app.stage.addChild(container)

function draw () {
  speed += mousePressed ? 0.025 : -1
  speed = Math.min(10, Math.max(2, speed))

  curColor = COLORS[((frame / 100) >> 0) % COLORS.length]

  for (let i = 0; i < speed / 10; i += 1) {
    createCircle(curColor, 32)
    frame++
  }

  list.forEach(p => {
    p.x += p.vx * speed * mouse.x
    p.y += p.vy * speed * mouse.y
    p.time += 1
    scale = 1 - (p.time / (190))
    p.scale.set(scale, scale)
  })

  do {
    if (list[0].time > 200) {
      container.removeChild(list.shift())
    } else {
      break
    }
  } while (list.length > 0)
}

function createCircle (c, h = 100) {
  const p = Sprite.from(ParticleImage)
  container.addChild(p)
  p.position.set(center.x, center.y)
  p.anchor.set(0.5, 0.5)
  p.width = p.height = h
  p.tint = c
  p.time = 0
  p.vx = Math.cos(Math.random() * PI2) * speed
  p.vy = Math.sin(Math.random() * PI2) * speed

  if (mousePressed) {
    p.vx *= 0.7 - mouse.x
    p.vy *= 0.7 - mouse.y
  }

  list.push(p)
}

window.addEventListener('mousedown', () => {
  mousePressed = true
})

window.addEventListener('mousemove', ({ clientX, clientY }) => {
  mouse.x = clientX / window.innerWidth - 0.5
  mouse.y = clientY / window.innerHeight - 0.5
})

window.addEventListener('mouseup', () => {
  mousePressed = false
})

document.body.appendChild(app.view)
app.ticker.add(() => draw())
app.start()
