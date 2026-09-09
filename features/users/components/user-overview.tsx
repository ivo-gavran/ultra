"use client";

import {
  ActivityIcon,
  BellIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  LockKeyholeIcon,
  PlusIcon,
  SettingsIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  UserFormDialog,
  type UserFormValues,
} from "@/features/users/components/user-form-dialog";
import { UsersTable } from "@/features/users/components/users-table";
import type { OverviewUser } from "@/features/users/data/users";

const navItems = [
  { label: "Overview", icon: LayoutDashboardIcon, active: false },
  { label: "Users", icon: UsersIcon, active: true },
  { label: "Roles & permissions", icon: ShieldCheckIcon, active: false },
  { label: "Activity", icon: ActivityIcon, active: false },
] as const;

interface UserOverviewProps {
  initialUsers: OverviewUser[];
}

export function UserOverview({ initialUsers }: UserOverviewProps) {
  const [users, setUsers] = useState(initialUsers);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<OverviewUser>();
  const [deletingUser, setDeletingUser] = useState<OverviewUser>();

  function createUser(values: UserFormValues) {
    const user: OverviewUser = {
      id: crypto.randomUUID(),
      ...values,
      lastActive: values.status === "Invited" ? "Never" : "Just now",
    };

    setUsers((current) => [user, ...current]);
    toast.success(`${user.name} was added to the workspace.`);
  }

  function updateUser(values: UserFormValues) {
    if (!editingUser) return;

    setUsers((current) =>
      current.map((user) =>
        user.id === editingUser.id ? { ...user, ...values } : user,
      ),
    );
    toast.success(`${values.name} was updated.`);
    setEditingUser(undefined);
  }

  function deleteUser() {
    if (!deletingUser) return;

    setUsers((current) =>
      current.filter((user) => user.id !== deletingUser.id),
    );
    toast.success(`${deletingUser.name} was removed.`);
    setDeletingUser(undefined);
  }

  const activeUsers = users.filter((user) => user.status === "Active").length;
  const pendingInvites = users.filter(
    (user) => user.status === "Invited",
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f7fa] text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-background lg:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white shadow-sm shadow-violet-600/20">
            N
          </div>
          <span className="text-base font-semibold tracking-tight">
            Northstar
          </span>
        </div>

        <div className="px-3 py-3">
          <Button
            variant="outline"
            className="h-10 w-full justify-between px-2.5"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback className="bg-violet-100 text-violet-700">
                  AS
                </AvatarFallback>
              </Avatar>
              <span className="truncate">Acme Studio</span>
            </span>
            <ChevronDownIcon className="text-muted-foreground" />
          </Button>
        </div>

        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-1 px-3 py-3"
        >
          <p className="px-2 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Workspace
          </p>
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                item.active
                  ? "bg-violet-50 text-violet-700 hover:bg-violet-100"
                  : ""
              }`}
            >
              <item.icon data-icon="inline-start" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-3">
          <Separator className="mb-3" />
          <Button variant="ghost" className="w-full justify-start">
            <SettingsIcon data-icon="inline-start" />
            Settings
          </Button>
          <div className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar>
              <AvatarFallback className="bg-zinc-900 text-white">
                OM
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Olivia Martin</p>
              <p className="truncate text-xs text-muted-foreground">
                olivia@northstar.co
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
              N
            </div>
            <span className="font-semibold">Northstar</span>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
            <LockKeyholeIcon className="size-4" />
            <span>Team settings</span>
            <span>/</span>
            <span className="font-medium text-foreground">Users</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
            <Avatar className="lg:hidden">
              <AvatarFallback className="bg-zinc-900 text-white">
                OM
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-violet-200 bg-violet-50 text-violet-700"
                >
                  <UserRoundIcon />
                  Team management
                </Badge>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
              <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
                Manage who can access your workspace and what they can do.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-violet-600 shadow-sm shadow-violet-600/20 hover:bg-violet-700"
              onClick={() => {
                setCreateOpen(true);
              }}
            >
              <PlusIcon data-icon="inline-start" />
              Add user
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Card className="py-0 shadow-xs">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total users</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {users.length}
                </p>
              </CardContent>
            </Card>
            <Card className="py-0 shadow-xs">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Active now</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-2xl font-semibold tabular-nums">
                    {activeUsers}
                  </p>
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    Healthy
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="py-0 shadow-xs">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Pending invites</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {pendingInvites}
                </p>
              </CardContent>
            </Card>
          </div>

          <section
            aria-labelledby="users-table-title"
            className="mt-5 overflow-hidden rounded-xl border bg-background shadow-xs"
          >
            <div className="flex items-start justify-between px-4 pt-5 sm:px-5">
              <div>
                <h2 id="users-table-title" className="font-semibold">
                  All users
                </h2>
                <p className="text-sm text-muted-foreground">
                  View and manage every member of your workspace.
                </p>
              </div>
            </div>
            <UsersTable
              users={users}
              onEdit={setEditingUser}
              onDelete={setDeletingUser}
            />
          </section>
        </main>
      </div>

      {createOpen && (
        <UserFormDialog
          mode="create"
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={createUser}
        />
      )}
      {editingUser && (
        <UserFormDialog
          mode="edit"
          open
          user={editingUser}
          onOpenChange={(open) => {
            if (!open) setEditingUser(undefined);
          }}
          onSubmit={updateUser}
        />
      )}

      {deletingUser && (
        <AlertDialog
          open
          onOpenChange={(open) => {
            if (!open) setDeletingUser(undefined);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-red-50 text-destructive">
                <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete {deletingUser.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes their workspace access. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={deleteUser}>
                Delete user
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
