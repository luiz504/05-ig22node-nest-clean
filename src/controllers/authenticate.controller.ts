import { Controller, Post } from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'

// const createAccountBodySchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
// })

// type CreateAccountBody = z.infer<typeof createAccountBodySchema>
@Controller('/sessions')
export class AuthenticateController {
  constructor(private readonly jwt: JwtService) {}
  @Post()
  //   @HttpCode(201)
  //   @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle() { //eslint-disable-line 
    const token = this.jwt.sign({ sub: 'user-id' })
    return token
  }
}
