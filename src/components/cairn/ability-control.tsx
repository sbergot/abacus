import { AbilityType } from "@/lib/game/cairn/types";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { AbilityCheckModal } from "./ability-check-modal";
import { useCurrentCharacter } from "@/app/cairn/cairn-context";
import { updateGauge } from "@/lib/game/cairn/utils";

interface AbilityControlProps {
  type: AbilityType;
}

export function AbilityControl({ type }: AbilityControlProps) {
  const { state: character, setState: setCharacter } = useCurrentCharacter();
  const value = character[type];
  return (
    <div className="h-7 flex gap-2 items-stretch justify-between">
      <div className="w-20 capitalize">{type}</div>
      <div>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setCharacter((d) => {
              updateGauge(d[type], v => v + 1);
            })
          }
        >
          <PlusIcon />
        </Button>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() =>
            setCharacter((d) => {
              updateGauge(d[type], v => v - 1);
            })
          }
        >
          <MinusIcon />
        </Button>
      </div>
      <div className="w-[42px] text-end">
        {value.current}/{value.max}
      </div>
      <div>
        <AbilityCheckModal type={type} character={character} />
      </div>
    </div>
  );
}