import CreateTeamForm from "@/components/forms/createTeamForm";
import React from "react";

export default function CreateTeamPage() {
  return (
    <div className="main-layout">
      <div className="border border-neutral-700 p-3">
        <h3 className="font-medium mb-2">Welcome to the Team Creator.</h3>
        <div className="text-sm">
          <p>Users can create teams and invite or allow other users to join.</p>
          <p>Each user can only create or join one team.</p>
          <span>Maximum users allowed per team: 6</span>
        </div>
      </div>
      <CreateTeamForm />
    </div>
  );
}
