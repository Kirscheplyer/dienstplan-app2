
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import App from "./DienstplanApp";

const clerkPubKey = "pk_test_cmVndWxhci1tb2xsdXNrLTc1LmNsZXJrLmFjY291bnRzLmRldiQ";

export default function Root() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <App />
      </SignedIn>
      <SignedOut>
        <SignIn routing="hash" path="/sign-in" />
      </SignedOut>
    </ClerkProvider>
  );
}
