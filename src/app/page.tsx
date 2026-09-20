import { MembershipForm } from "./membership-form";

export default function HomePage() {
  return (
    <main>
      <h1>CancelWatch</h1>
      <p>
        Gyms, insurance, storage units, kid activities — any membership or
        contract with a cancellation notice window auto-renews if you miss
        it. Track the deadline so you don&apos;t get charged again.
      </p>
      <MembershipForm />
    </main>
  );
}
