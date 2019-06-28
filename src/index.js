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

const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  backgroundColor: 0xf3f3f3
})

let frame = 0
let x = window.innerWidth >> 1
let y = window.innerHeight >> 1
let curColor
let container = new ParticleContainer()
let mousePressed = false
let speed = 1
app.stage.addChild(container)

const list = []

function draw () {
  if (mousePressed) {
    speed += 0.25
  } else {
    speed -= 1
  }

  speed = Math.min(20, Math.max(1, speed))

  curColor = COLORS[((frame / 100) >> 0) % COLORS.length]

  for (let i = 0; i < speed / 10; i += 1) {
    createCircle(x, y, curColor, 32)
    frame++
  }

  list.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    p.time += 1
    const s = 1 - (p.time / 190)
    p.scale.set(s, s)
  })

  do {
    if (list[0].time > 200) {
      container.removeChild(list.shift())
    } else {
      break
    }
  } while (list.length > 0)
}

function createCircle (x, y, c, h = 100) {
  const p = Sprite.from(ParticleImage)
  container.addChild(p)
  p.position.set(x, y)
  p.width = p.height = h
  p.tint = c
  p.time = 0
  p.vx = Math.cos(Math.random() * PI2) * speed
  p.vy = Math.sin(Math.random() * PI2) * speed
  list.push(p)
  return p
}

window.addEventListener('mousedown', () => {
  mousePressed = true
})
window.addEventListener('mouseup', () => {
  mousePressed = false
})

document.body.appendChild(app.view)
app.ticker.add(() => draw())
app.start()
