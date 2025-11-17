import { Globe, Lock, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { DialogFooter } from './ui/dialog'

export const THEMES = [
  { value: '🪷', label: 'Zen Garden', emoji: '🪷' },
  { value: '☕️', label: 'Midnight Café', emoji: '☕️' },
  { value: '💻', label: 'Cyber Loft', emoji: '💻' },
  { value: '🚀', label: 'Outer Space', emoji: '🚀' },
  { value: '☁️', label: 'Cloud Room', emoji: '☁️' },
  { value: '🏢', label: 'Meeting Room', emoji: '🏢' },
]

export interface CreateRoomFormProps {
  formData: {
    name: string
    visibility: 'public' | 'private'
    theme: string
    musicUrl: string
    maxUsers: number | undefined
  }
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string
      visibility: 'public' | 'private'
      theme: string
      musicUrl: string
      maxUsers: number | undefined
    }>
  >
  onSubmit: (e: React.FormEvent) => void
  isCreating: boolean
  onCancel: () => void
  inputIdPrefix?: string
  isEditing?: boolean
}

export function CreateRoomForm({
  formData,
  setFormData,
  onSubmit,
  isCreating,
  onCancel,
  inputIdPrefix = '',
  isEditing = false,
}: CreateRoomFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label
          htmlFor={`name${inputIdPrefix}`}
          className="text-[13px] font-medium text-slate-900"
        >
          Room Name
        </Label>
        <Input
          id={`name${inputIdPrefix}`}
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., My Focus Space"
          required
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor={`visibility${inputIdPrefix}`}
            className="text-[13px] font-medium text-slate-900"
          >
            Visibility
          </Label>
          <Select
            value={formData.visibility}
            onValueChange={(value: 'public' | 'private') =>
              setFormData({ ...formData, visibility: value })
            }
          >
            <SelectTrigger id={`visibility${inputIdPrefix}`} className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Public
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Private
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor={`theme${inputIdPrefix}`}
            className="text-[13px] font-medium text-slate-900"
          >
            Theme
          </Label>
          <Select
            value={formData.theme}
            onValueChange={(value) =>
              setFormData({ ...formData, theme: value })
            }
          >
            <SelectTrigger id={`theme${inputIdPrefix}`} className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  <div className="flex items-center gap-2">
                    <span>{theme.emoji}</span>
                    <span>{theme.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor={`musicUrl${inputIdPrefix}`}
            className="text-[13px] font-medium text-slate-900"
          >
            Music URL (Optional)
          </Label>
          <Input
            id={`musicUrl${inputIdPrefix}`}
            type="url"
            value={formData.musicUrl}
            onChange={(e) =>
              setFormData({ ...formData, musicUrl: e.target.value })
            }
            placeholder="https://..."
            className="mt-2"
          />
        </div>

        <div>
          <Label
            htmlFor={`maxUsers${inputIdPrefix}`}
            className="text-[13px] font-medium text-slate-900"
          >
            Max Users (Optional)
          </Label>
          <Input
            id={`maxUsers${inputIdPrefix}`}
            type="number"
            value={formData.maxUsers || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxUsers: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="No limit"
            min="1"
            className="mt-2"
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isCreating}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-500 text-[13px] font-semibold tracking-tight shadow-sm shadow-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 transition-all text-slate-50 hover:bg-emerald-600 hover:shadow-emerald-600/50"
        >
          {isCreating
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
              ? 'Update Room'
              : 'Create Room'}
          <Sparkles className="size-4" />
        </Button>
      </DialogFooter>
    </form>
  )
}
