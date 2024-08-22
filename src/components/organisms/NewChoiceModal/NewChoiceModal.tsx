import {useContext, useState} from "react";
import css from './NewChoiceModal.module.scss';
import {FlexAlign, FlexGap} from "../../atoms/Flex/Flex.types.ts";
import Flex from "../../atoms/Flex/Flex.tsx";
import TextInput from "../../atoms/TextInput/TextInput.tsx";
import {AppContext} from "../../../stores/AppContext.ts";
import {Connection} from "@xyflow/react";

interface NewChoiceModalProps {
  isOpen: boolean,
  onClose: () => void,
  edgeInfo: Connection | null
}

const NewChoiceModal = ({ isOpen, onClose, edgeInfo }: NewChoiceModalProps) => {
  const {
    ApplicationStore,
  } = useContext(AppContext);

  function handleSubmit(){
    const current = ApplicationStore.current;
    if(current && label.trim().length > 0 && edgeInfo){
      ApplicationStore.addChoice(current.id, edgeInfo.source, edgeInfo.target, label)
      setLabel('');
      onClose();
    }

  }

  const [label, setLabel] = useState('');

  if (!isOpen) return null;

  return (
    <div className={css.backdrop}>
      <Flex className={css.card} gap={FlexGap.SM} alignItems={FlexAlign.CENTER}>
        <TextInput label="Enter choice text" value={label} onChange={(value) => setLabel(value)} />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </Flex>
    </div>

  );
};

export default NewChoiceModal;
