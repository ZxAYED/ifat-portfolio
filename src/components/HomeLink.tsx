import type { ComponentPropsWithoutRef } from "react";

/** Native navigation preserves modified clicks, history and new tabs.
 * The motion runtime resolves #top to document zero, never to a sticky header.
 */
export default function HomeLink(props: ComponentPropsWithoutRef<"a">) {
  return <a {...props} />;
}
