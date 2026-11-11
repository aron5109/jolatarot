import { SPREADS, type SpreadId } from '../data/cards';

interface SpreadPickerProps {
  value: SpreadId;
  disabled: boolean;
  onChange: (spread: SpreadId) => void;
}

const OPTIONS: SpreadId[] = ['one', 'three'];

/** Choose between a single card and a three-card spread. */
export function SpreadPicker({ value, disabled, onChange }: SpreadPickerProps) {
  return (
    <fieldset className="spread-picker" disabled={disabled}>
      <legend className="visually-hidden">Fjöldi spila</legend>
      {OPTIONS.map((id) => (
        <label key={id} className="spread-picker__option" data-checked={value === id || undefined}>
          <input
            type="radio"
            name="spread"
            value={id}
            checked={value === id}
            onChange={() => onChange(id)}
          />
          <span>{SPREADS[id].label}</span>
        </label>
      ))}
    </fieldset>
  );
}
