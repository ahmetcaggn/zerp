import React from "react";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-bg">
      <div className="shell shell--center">
        <div className="shell-body shell-body--full">{children}</div>
      </div>
    </div>
  );
}
