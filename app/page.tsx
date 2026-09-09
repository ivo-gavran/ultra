import { UserOverview } from "@/features/users/components/user-overview";
import { initialUsers } from "@/features/users/data/users";

export default function Home() {
  return <UserOverview initialUsers={initialUsers} />;
}
