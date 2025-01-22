import { ApplicationVariableType } from '@shared/types';

import css from './VariableType.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface VariableTypeProps {
  type: ApplicationVariableType;
}

export function VariableType({ type }: VariableTypeProps) {
  function render() {
    switch (type) {
      case ApplicationVariableType.STRING:
        return <FontAwesomeIcon icon={['fas', 'i-cursor']} />;
      case ApplicationVariableType.BOOLEAN:
        return <FontAwesomeIcon icon={['fas', 'square-binary']} />;
      case ApplicationVariableType.NUMBER:
        return <FontAwesomeIcon icon={['fas', 'hashtag']} />;
      default:
        return <>[{type}]</>;
    }
  }

  return <span className={css.variableType}>{render()}</span>;
}
