"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OverviewUser } from "@/features/users/data/users";
import { userRoles, userStatuses } from "@/features/users/data/users";

const userFormSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters."),
  email: z.email("Enter a valid email address."),
  role: z.enum(userRoles),
  status: z.enum(userStatuses),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

const emptyValues: UserFormValues = {
  name: "",
  email: "",
  role: "Member",
  status: "Active",
};

interface UserFormDialogProps {
  mode: "create" | "edit";
  open: boolean;
  user?: OverviewUser;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => void;
}

export function UserFormDialog({
  mode,
  open,
  user,
  onOpenChange,
  onSubmit,
}: UserFormDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;

    form.reset(
      user
        ? {
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
          }
        : emptyValues,
    );
  }, [form, open, user]);

  function handleSubmit(values: UserFormValues) {
    onSubmit(values);
    onOpenChange(false);
  }

  const isEditing = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit user" : "Add a new user"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this user’s account details and access."
              : "Create an account and choose its initial access level."}
          </DialogDescription>
        </DialogHeader>

        <form
          id={`${mode}-user-form`}
          onSubmit={(event) => {
            void form.handleSubmit(handleSubmit)(event);
          }}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${mode}-name`}>Full name</FieldLabel>
                  <Input
                    {...field}
                    id={`${mode}-name`}
                    aria-invalid={fieldState.invalid}
                    autoComplete="name"
                    placeholder="e.g. Jamie Chen"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${mode}-email`}>
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`${mode}-email`}
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                    placeholder="name@company.com"
                    type="email"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${mode}-role`}>Role</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id={`${mode}-role`}
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${mode}-status`}>Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id={`${mode}-status`}
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form={`${mode}-user-form`}>
            {isEditing ? "Save changes" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
