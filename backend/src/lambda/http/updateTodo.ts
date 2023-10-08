import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../service/todoService'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing UpdateTodo event...')

    try {
      const todoId = event.pathParameters.todoId
      const updateTodoRequest: UpdateTodoRequest = JSON.parse(event.body)

      await updateTodo(todoId, updateTodoRequest)
      logger.info(`Successfully updated the todo: ${todoId}`)

      return {
        statusCode: 204
      }
    } catch (error) {
      logger.error(`Error: ${error.message}`)

      return {
        statusCode: 500,
        body: JSON.stringify({ error })
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
