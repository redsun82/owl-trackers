import { Tooltip } from "@mui/material";
import IconButton from "./IconButton";
import SimpleMinusIcon from "../icons/SimpleMinusIcon";
import SimplePlusIcon from "../icons/SimplePlusIcon";
import PartiallyControlledInput from "./PartiallyControlledInput";

export default function SizeInput({
  sizePercentage,
  onSizeChange,
}: {
  sizePercentage: number;
  onSizeChange: (newSize: number) => void;
}): React.JSX.Element {
  const displayValue = sizePercentage ?? 100;

  const increment = () => {
    onSizeChange(displayValue + 10);
  };

  const decrement = () => {
    const newSize = Math.max(1, displayValue - 10);
    onSizeChange(newSize);
  };

  const handleInputChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      onSizeChange(parsed);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-px rounded bg-paper-dark/10 dark:bg-paper/10 px-0.5">
        <Tooltip title="Decrease Size" placement="bottom">
          <div>
            <IconButton
              Icon={SimpleMinusIcon}
              onClick={decrement}
              className="h-7 w-7"
            />
          </div>
        </Tooltip>
        <PartiallyControlledInput
          parentValue={displayValue.toString()}
          onUserConfirm={(target) => handleInputChange(target.value)}
          className="h-7 w-12 bg-transparent text-center text-sm outline-none text-text-primary dark:text-text-primary-dark"
        />
        <span className="text-sm font-bold text-text-secondary dark:text-text-secondary-dark">
          %
        </span>
        <Tooltip title="Increase Size" placement="bottom">
          <div>
            <IconButton
              Icon={SimplePlusIcon}
              onClick={increment}
              className="h-7 w-7"
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
