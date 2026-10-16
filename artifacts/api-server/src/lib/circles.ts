export interface CircleDef {
  id: string;
  name: string;
  tag: string;
}

export const CIRCLES: CircleDef[] = [
  { id: "academic", name: "Academic Pressure", tag: "Studies" },
  { id: "loneliness", name: "Loneliness", tag: "Connection" },
  { id: "grief", name: "Grief", tag: "Loss" },
  { id: "relationship", name: "Relationship Transitions", tag: "Life Changes" },
  { id: "work", name: "Work Stress", tag: "Career" },
  { id: "identity", name: "Identity", tag: "Self" },
];

export function isCircleId(id: string): boolean {
  return CIRCLES.some((c) => c.id === id);
}
