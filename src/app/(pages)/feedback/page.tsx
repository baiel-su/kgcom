import { Construction } from "lucide-react";
import React from "react";

const Feedback = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p>This page is under development</p>
      <span role="img" aria-label="construction">
        <Construction />
      </span>
    </div>
  );
};

export default Feedback;
