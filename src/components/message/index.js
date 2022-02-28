import './index.css'

function createMsgDOM(msg) {
  if (document.getElementById('random-messager')) return
  const messager = document.createElement('div')
  messager.innerText = msg
  messager.id = 'random-messager'
  messager.className = 'messager'
  document.body.appendChild(messager)
  setTimeout(() => {
    messager.style.transform = 'scale(1.0)'
  }, 0)

  setTimeout(() => {
    messager.style.opacity = 0
    messager.style.transform = 'scale(0.2)'
    setTimeout(() => messager.remove(), 300)
  }, 1000)

  return messager
}

function success(msg) {
  const successMsg = createMsgDOM(msg)
  if (!successMsg) return
  successMsg.style.color = '#02bbff'
}

function error(msg) {
  const errorMsg = createMsgDOM(msg)
  if (!errorMsg) return
  errorMsg.style.color = 'red'
}

function warning(msg) {
  const warning = createMsgDOM(msg)
  if (!warning) return
  warning.style.color = 'orange'
}

export default {
  success,
  error,
  warning,
}
