import { Cpu, User } from "react-feather"

export default function Message({
  conversationItem,
}: {
  conversationItem: { role: string; formatted: { transcript: string } }
}) {
  return (
    <div className="flex max-w-full flex-row flex-wrap items-start gap-x-3">
      <div className="max-w-max rounded border p-2">
        {conversationItem.role === "user" ? <User /> : <Cpu />}
      </div>
      <div className="flex flex-col gap-y-2">
        {conversationItem.formatted.transcript}
      </div>
    </div>
  )
}
