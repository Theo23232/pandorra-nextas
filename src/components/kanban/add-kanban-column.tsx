import { Plus } from 'lucide-react';

export const AddKanbanColumn = () => {
  return (
    <div className="flex h-full min-w-80 flex-col">
      <div className="ounded-t-lg mb-2 flex cursor-move items-center justify-between rounded border border-border bg-muted px-4 py-3">
        <h2 className="text-lg font-semibold text-sidebar-foreground">
          Add a new column
        </h2>
        <Plus size={24} className="cursor-pointer" />
      </div>

      <div className="min-h-[500px] flex-1 rounded bg-muted p-2"></div>
    </div>
  )
}
