"use client";

import { useMemo } from "react";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  PencilIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OverviewUser, UserStatus } from "@/features/users/data/users";

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filterFns: {
    equalsString: filterFn_equalsString,
    includesString: filterFn_includesString,
  },
  sortFns: { text: sortFn_text },
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, OverviewUser>();

const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function colorForUser(id: string) {
  const total = Array.from(id).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );

  return avatarColors[total % avatarColors.length];
}

function statusStyles(status: UserStatus) {
  switch (status) {
    case "Active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Invited":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "Inactive":
      return "border-zinc-200 bg-zinc-50 text-zinc-600";
  }
}

interface UsersTableProps {
  users: OverviewUser[];
  onEdit: (user: OverviewUser) => void;
  onDelete: (user: OverviewUser) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("name", {
          filterFn: "includesString",
          sortFn: "text",
          header: ({ column }) => {
            const direction = column.getIsSorted();
            const SortIcon =
              direction === "asc"
                ? ArrowUpIcon
                : direction === "desc"
                  ? ArrowDownIcon
                  : ArrowUpDownIcon;

            return (
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2 h-7"
                onClick={() => {
                  column.toggleSorting(direction === "asc");
                }}
              >
                User
                <SortIcon
                  data-icon="inline-end"
                  className="text-muted-foreground"
                />
              </Button>
            );
          },
          cell: ({ row }) => (
            <div className="flex min-w-56 items-center gap-3">
              <Avatar>
                <AvatarFallback className={colorForUser(row.original.id)}>
                  {initials(row.original.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">
                  {row.original.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.original.email}
                </p>
              </div>
            </div>
          ),
        }),
        columnHelper.accessor("role", {
          sortFn: "text",
          header: ({ column }) => {
            const direction = column.getIsSorted();
            return (
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2 h-7"
                onClick={() => {
                  column.toggleSorting(direction === "asc");
                }}
              >
                Role
                <ArrowUpDownIcon
                  data-icon="inline-end"
                  className="text-muted-foreground"
                />
              </Button>
            );
          },
          cell: ({ getValue }) => (
            <span className="text-muted-foreground">{getValue()}</span>
          ),
        }),
        columnHelper.accessor("status", {
          filterFn: "equalsString",
          header: "Status",
          cell: ({ getValue }) => {
            const status = getValue();
            return (
              <Badge variant="outline" className={statusStyles(status)}>
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-current"
                />
                {status}
              </Badge>
            );
          },
        }),
        columnHelper.accessor("lastActive", {
          header: "Last active",
          enableSorting: false,
          cell: ({ getValue }) => (
            <span className="text-muted-foreground">{getValue()}</span>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: () => <span className="sr-only">Actions</span>,
          cell: ({ row }) => (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Actions for ${row.original.name}`}
                    />
                  }
                >
                  <MoreHorizontalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        onEdit(row.original);
                      }}
                    >
                      <PencilIcon />
                      Edit user
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      onDelete(row.original);
                    }}
                  >
                    <Trash2Icon />
                    Delete user
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
          enableSorting: false,
          enableColumnFilter: false,
        }),
      ]),
    [onDelete, onEdit],
  );

  const table = useTable({
    features,
    columns,
    data: users,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 6 },
    },
  });

  const nameFilterValue = table.getColumn("name")?.getFilterValue();
  const statusFilterValue = table.getColumn("status")?.getFilterValue();
  const nameFilter = typeof nameFilterValue === "string" ? nameFilterValue : "";
  const statusFilter =
    typeof statusFilterValue === "string" ? statusFilterValue : "all";
  const filteredCount = table.getFilteredRowModel().rows.length;

  function clearFilters() {
    table.resetColumnFilters(true);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Filter users by name"
            className="pl-8"
            placeholder="Filter users..."
            value={nameFilter}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              table
                .getColumn("status")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="min-w-32" aria-label="Filter by status">
              <SelectValue>
                {statusFilter === "all" ? "All statuses" : statusFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Invited">Invited</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {(nameFilter || statusFilter !== "all") && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <XIcon data-icon="inline-start" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <Table>
        <TableHeader className="bg-muted/40">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={
                    header.column.id === "actions" ? "w-12" : undefined
                  }
                >
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id} className="h-16">
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-56 text-center">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <SearchIcon className="size-5 text-muted-foreground" />
                  </div>
                  <p className="font-medium">No users found</p>
                  <p className="text-sm text-muted-foreground">
                    Try changing or clearing your filters.
                  </p>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {filteredCount} user
          {filteredCount === 1 ? "" : "s"}
        </p>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Rows per page
            </span>
            <Select
              value={String(table.state.pagination.pageSize)}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-17" aria-label="Rows per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[6, 10, 14].map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm font-medium tabular-nums">
            Page {table.state.pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous page"
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                table.previousPage();
              }}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next page"
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.nextPage();
              }}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
