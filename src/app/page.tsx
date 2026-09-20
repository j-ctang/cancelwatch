import { MembershipForm } from "./membership-form";

export default function HomePage() {
  return (
    <main>
      <h1>CancelWatch</h1>
      <p>
        Kid activity memberships auto-renew past their cancellation window.
        Track the deadline so you don&apos;t get charged again.
      </p>
      <MembershipForm />
    </main>
  );
}
