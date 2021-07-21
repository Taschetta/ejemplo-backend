
export const handler = (endpointFn) => async (req, res) => {
  try {
    const { status, ...data } = await endpointFn({ request: req })

    res
      .header('Content-Type', 'application/json')
      .status(status || 200)
      .send(data)
  
  } catch (error) {
    switch (error.name) {
      case 'QueryError':
        res.status(400).send({ success: false, message: error.message, field: error.param })
        break;
      default:
        console.log(error)
        res.status(500).send({ success: false, message: 'Error Interno' })
        break;
    }
  }
}