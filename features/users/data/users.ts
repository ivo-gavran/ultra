export const userRoles = ["Admin", "Member", "Viewer"] as const;
export const userStatuses = ["Active", "Invited", "Inactive"] as const;

export type UserRole = (typeof userRoles)[number];
export type UserStatus = (typeof userStatuses)[number];

export interface OverviewUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
}

export const initialUsers: OverviewUser[] = [
  {
    id: "usr_01",
    name: "Olivia Martin",
    email: "olivia@northstar.co",
    role: "Admin",
    status: "Active",
    lastActive: "2 min ago",
  },
  {
    id: "usr_02",
    name: "Jackson Lee",
    email: "jackson@northstar.co",
    role: "Member",
    status: "Active",
    lastActive: "18 min ago",
  },
  {
    id: "usr_03",
    name: "Sophia Brown",
    email: "sophia@northstar.co",
    role: "Viewer",
    status: "Invited",
    lastActive: "Never",
  },
  {
    id: "usr_04",
    name: "Noah Williams",
    email: "noah@northstar.co",
    role: "Member",
    status: "Active",
    lastActive: "1 hr ago",
  },
  {
    id: "usr_05",
    name: "Emma Davis",
    email: "emma@northstar.co",
    role: "Member",
    status: "Inactive",
    lastActive: "3 days ago",
  },
  {
    id: "usr_06",
    name: "Liam Wilson",
    email: "liam@northstar.co",
    role: "Viewer",
    status: "Active",
    lastActive: "5 hrs ago",
  },
  {
    id: "usr_07",
    name: "Mia Anderson",
    email: "mia@northstar.co",
    role: "Member",
    status: "Active",
    lastActive: "Yesterday",
  },
  {
    id: "usr_08",
    name: "Ethan Taylor",
    email: "ethan@northstar.co",
    role: "Member",
    status: "Invited",
    lastActive: "Never",
  },
  {
    id: "usr_09",
    name: "Ava Thompson",
    email: "ava@northstar.co",
    role: "Admin",
    status: "Active",
    lastActive: "2 days ago",
  },
  {
    id: "usr_10",
    name: "Lucas Garcia",
    email: "lucas@northstar.co",
    role: "Viewer",
    status: "Inactive",
    lastActive: "2 weeks ago",
  },
  {
    id: "usr_11",
    name: "Isabella Martinez",
    email: "isabella@northstar.co",
    role: "Member",
    status: "Active",
    lastActive: "40 min ago",
  },
  {
    id: "usr_12",
    name: "Mason Robinson",
    email: "mason@northstar.co",
    role: "Member",
    status: "Active",
    lastActive: "4 hrs ago",
  },
  {
    id: "usr_13",
    name: "Amelia Clark",
    email: "amelia@northstar.co",
    role: "Viewer",
    status: "Invited",
    lastActive: "Never",
  },
  {
    id: "usr_14",
    name: "James Rodriguez",
    email: "james@northstar.co",
    role: "Member",
    status: "Active",
    lastActive: "Yesterday",
  },
];
