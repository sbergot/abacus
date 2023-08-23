import { ChatMessage } from "@/lib/network/types";
import { BaseGame } from "../types";

export interface Gauge {
  current: number;
  max: number;
}

export type AbilityType = "strength" | "dexterity" | "willpower";

export interface CairnCharacterBase {
  id: string;
  name: string;
  age: number;
  background: string;
  traits: string;
  strength: Gauge;
  dexterity: Gauge;
  willpower: Gauge;
  hp: Gauge;
  gold: number;
  silver: number;
  copper: number;
  deprived: boolean;
  inventory: Slot[];
}

export interface CarryCapacity {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: Slot[];
}

export interface CairnCharacter extends CairnCharacterBase {
  hireLings: CairnCharacter[];
  carryCapacities: CarryCapacity[];
}

export interface CairnNpc extends CairnCharacter {
  visibleToAll: boolean;
  excludedFromRandomPick: boolean;
}

type TaggedUnion<T extends string, P> = { type: T } & P;

export type SlotType = string;

export type SlotState =
  | TaggedUnion<"empty", {}>
  | TaggedUnion<"fatigue", {}>
  | TaggedUnion<"bulky", { slotId: string; name: string }>
  | TaggedUnion<"gear", { gear: Gear }>;

export interface Slot {
  id: string;
  type: SlotType;
  state: SlotState;
}

export interface Gear {
  id: string;
  name: string;
  bulky?: boolean;
  blast?: boolean;
  charges?: Gauge;
  price?: number;
  damage?: number;
  armor?: number;
}

export type RollMode = "normal" | "advantage" | "disadvantage";

export interface AbilityCheck {
  abilityName: AbilityType;
  abilityValue: number;
  mode: RollMode;
}

export interface AbilityRollAnalysis {
  check: AbilityCheck;
  results: DiceRollAnalysis;
  isSuccess: boolean;
}

export interface AttackRollResult {
  dice: number;
  result: number;
}

export type CairnMessage =
  | ChatMessage<"Scarred", {}>
  | ChatMessage<"AbilityRoll", AbilityRollAnalysis>
  | ChatMessage<"AttackRoll", AttackRollResult>;


export interface CairnGame extends BaseGame<CairnMessage> {
  npcs: CairnNpc[];
}
