import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <div>{children}</div>
    </div>
  );
};

export default layout;
