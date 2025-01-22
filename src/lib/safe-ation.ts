import { currentUser } from "@/lib/current-user"
import { User } from "@/types/next"

type ActionFunction<TArgs extends any[], TReturn> = (
  user: User,
  ...args: TArgs
) => TReturn | Promise<TReturn>

export function SA<TArgs extends any[], TReturn>(
  action: ActionFunction<TArgs, TReturn>,
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    const user = await currentUser()
    if (!user) {
      throw new Error("You are not authenticated")
    }

    return action(user, ...args)
  }
}
