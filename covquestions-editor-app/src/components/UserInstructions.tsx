import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Typography } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import { getInstructions } from "../api/api-client";

type UserInstructionsProps = { open: boolean; onClose: () => void };

export const UserInstructions: React.FC<UserInstructionsProps> = (props) => {
  const [instructions, setInstructions] = useState<string>("Loading...");
  const [alreadyLoaded, setAlreadyLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (props.open && !alreadyLoaded) {
      getInstructions()
        .then((value) => {
          setInstructions(value ?? "Empty or no user instructions available.");
          setAlreadyLoaded(true);
        })
        .catch(() => {
          setInstructions("Failed to load instructions.");
        });
    }
  }, [props.open, alreadyLoaded]);

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="lg">
      <DialogContent>
        <Typography>
          <ReactMarkdown children={instructions} />
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
