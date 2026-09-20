import { listMembershipsByToken } from "@/lib/memberships-repo";
import { daysRemaining } from "@/lib/days-remaining";
import { MembershipForm } from "@/app/membership-form";
import { cancelAction, deleteAction } from "./actions";

export default async function DashboardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const rows = await listMembershipsByToken(token);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main>
      <h1>Your memberships</h1>
      <ul>
        {rows.map((row) => (
          <li key={row.id}>
            <span>{row.activityName}</span>{" "}
            <span>({row.category})</span>{" "}
            <span>cancel by {row.nextDeadline}</span>{" "}
            <span>({daysRemaining(row.nextDeadline, today)} days left)</span>{" "}
            {row.canceledAt ? (
              <span>canceled</span>
            ) : (
              <form action={cancelAction.bind(null, token)} style={{ display: "inline" }}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit">Mark canceled</button>
              </form>
            )}
            <form action={deleteAction.bind(null, token)} style={{ display: "inline" }}>
              <input type="hidden" name="id" value={row.id} />
              <button type="submit">Delete</button>
            </form>
          </li>
        ))}
      </ul>
      <h2>Add another membership</h2>
      <MembershipForm />
    </main>
  );
}
