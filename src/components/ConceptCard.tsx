import type { ConceptCard as ConceptCardType } from '../types/game'

interface Props {
  card: ConceptCardType
  onDismiss: () => void
}

export function ConceptCard({ card, onDismiss }: Props) {
  return (
    <div
      className="bg-primary/15 border border-primary/30 rounded-xl p-4 text-center cursor-pointer"
      onClick={onDismiss}
    >
      <div className="text-[10px] font-bold text-primary-light uppercase tracking-wider mb-1">
        {card.emoji} {card.title}
      </div>
      <div className="text-lg font-bold text-text-primary mb-1">{card.term}</div>
      <div className="text-sm text-text-secondary">{card.definition}</div>
      <div className="text-[10px] text-text-secondary mt-2 opacity-50">Tap to dismiss</div>
    </div>
  )
}
