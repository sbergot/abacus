import { ButtonLike } from "@/components/ui/button-like";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WeakEmph } from "@/components/ui/typography";
import { GmContent } from "@/lib/game/types";
import { pickRandom } from "@/lib/random";
import { ILens } from "@/lib/types";
import { DicesIcon } from "lucide-react";
import { useState } from "react";

interface RandomEntryDialogProps {
  lens: ILens<GmContent[]>;
  name: string;
}

export function RandomEntryDialog({ lens, name }: RandomEntryDialogProps) {
  const [entry, setEntry] = useState<GmContent | undefined>(undefined);
  return (
    <Dialog
      onOpenChange={(open) =>
        open &&
        setEntry(
          pickRandom(lens.state.filter((e) => !e.excludedFromRandomPick))
        )
      }
    >
      <DialogTrigger asChild>
        <ButtonLike>
          <DicesIcon /> Pick random {name}
        </ButtonLike>
      </DialogTrigger>
      <DialogContent>
        {entry === undefined ? (
          "no pickable entry"
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{entry.name}</DialogTitle>
            </DialogHeader>
            {entry.description}
            <WeakEmph>{entry.privateNotes}</WeakEmph>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
