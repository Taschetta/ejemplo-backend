import './config/index.js'
import app from './app/index.js'

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en puerto ${process.env.PORT}`)
})