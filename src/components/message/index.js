import './index.css'

function createMsgDOM(msg) {
  const messager = document.createElement('div')
  messager.innerText = msg
  messager.className = 'messager'
  document.body.appendChild(messager)
  setTimeout(() => {
    messager.style.transform = 'scale(1.0)'
  }, 0)

  setTimeout(() => {
    messager.style.opacity = 0
    messager.style.transform = 'scale(0.2)'
    setTimeout(() => messager.remove(), 1000)
  }, 1000)

  return messager
}

function success(msg) {
  const successMsg = createMsgDOM(msg)
  successMsg.style.color = 'green'
}

function error(msg) {
  const errorMsg = createMsgDOM(msg)
  errorMsg.style.color = 'red'
}

function warning(msg) {
  const warning = createMsgDOM(msg)
  warning.style.color = 'orange'
}

export default {
  success,
  error,
  warning,
}
