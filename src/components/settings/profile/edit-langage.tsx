import { editLangange } from "@/actions/user.ations"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tremor/inputs/select"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"

export function EditLangage() {
  const { user } = useUser()
  const { toast } = useToast()
  const data = [
    {
      value: "en",
      label: "English",
    },
    {
      value: "fr",
      label: "French",
    },
    {
      value: "es",
      label: "Spanish",
    },
    {
      value: "it",
      label: "Italian",
    },
  ]

  const handleEdit = async (value: string) => {
    await editLangange(value)
      .then(() => {
        toast({
          title: "Success",
          description: "Your prefered langage has been updated successfully.",
          variant: "success",
          duration: 3000,
        })
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: e.message,
          variant: "error",
          duration: 3000,
        })
      })
  }
  if (user) {
    return (
      <Select
        onValueChange={(value) => handleEdit(value)}
        defaultValue={user.language}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select langage" />
        </SelectTrigger>
        <SelectContent>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
}
