"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import { MessagePanel } from "@/components/generic-pages/message-panel";
import { CairnMessage } from "@/lib/game/cairn/types";
import {
  useCurrentCharacter,
  usePlayerConnectionContext,
} from "@/app/cairn/cairn-context";
import { ShowCustomMessage } from "@/components/cairn/show-custom-message";
import { Shop } from "@/components/cairn/shop";

export default function Session() {
  const characterLens = useCurrentCharacter();
  const { messages } = usePlayerConnectionContext();
  return (
    <TwoColumns
      leftPart={<Shop />}
      rightPart={
        <MessagePanel<CairnMessage>
          context={{ contextType: "player", authorId: characterLens.state.id }}
          messages={messages}
          ShowCustomMessage={ShowCustomMessage}
        />
      }
    />
  );
}