

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button as BaseButton } from "@/components/ui/button"
import {
  Field as RawField,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field"

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-lg border border-input bg-background p-6 shadow-sm">
      {children}
    </div>
  )
}

export function Field({ label, error, children }: { label?: React.ReactNode; error?: any; children?: React.ReactNode }) {
  return (
    <RawField>
      {label && <FieldLabel>{label}</FieldLabel>}
      <FieldContent>{children}</FieldContent>
      {error && <FieldError>{String(error)}</FieldError>}
    </RawField>
  )
}

export function TextInput(props: React.ComponentProps<typeof Input> & { error?: any }) {
  const { error, ...rest } = props
  return <Input {...rest} aria-invalid={!!error} />
}

export function PasswordInput({
  show,
  onToggle,
  error,
  ...props
}: React.ComponentProps<typeof Input> & { show?: boolean; onToggle?: () => void; error?: any }) {
  return (
    <div className="relative">
      <Input {...(props as any)} type={show ? "text" : "password"} aria-invalid={!!error} />
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={show}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  )
}

export const Button = BaseButton
