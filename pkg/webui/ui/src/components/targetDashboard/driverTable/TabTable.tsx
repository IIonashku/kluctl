import { FC } from "react";

export const TabTable: FC<{ type: "target" | "history" | null }> = ({
  type,
}) => {
  if (type === "history") {
    return <>"history"</>;
  } else {
    return <>"targets"</>;
  }
};
